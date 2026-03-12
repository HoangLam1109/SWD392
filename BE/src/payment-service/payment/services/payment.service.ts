import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { OrderService } from '../../order/services/order.service';
import { PaymentStatus } from '../../order/enum/status.enum';
import { vnpay } from '../../../config/vnpay.config';
import { ProductCode, VnpLocale, ReturnQueryFromVNPay } from 'vnpay';
import { TransactionService } from '../../transaction/services/transaction.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaginationService } from '../../../common/services/pagination.service';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaymentDocument } from '../entities/payment.entity';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paginationService: PaginationService,
    private readonly orderService: OrderService,
    private readonly transactionService: TransactionService,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentDocument> {
    return await this.paymentRepository.create(createPaymentDto);
  }

  async findByCode(code: string): Promise<PaymentDocument | null> {
    return await this.paymentRepository.findByCode(code);
  }

  async findPaymentById(id: string): Promise<PaymentDocument | null> {
    return await this.paymentRepository.findById(id);
  }

  async findAll(): Promise<PaymentDocument[]> {
    return await this.paymentRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<PaymentDocument>> {
    return this.paginationService.paginate(this.paymentRepository, options);
  }

  async updatePayment(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentDocument | null> {
    return await this.paymentRepository.updateById(id, updatePaymentDto);
  }

  async createDepositVnpayUrl(
    transactionId: string,
    totalPrice: number,
    ipAddr: string,
  ): Promise<{ redirectUrl: string }> {
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalPrice || 0,
      vnp_IpAddr: ipAddr || '',
      vnp_TxnRef: transactionId || '',
      vnp_OrderInfo: `Payment for deposit for transaction ${transactionId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL!,
      vnp_Locale: VnpLocale.VN,
    });

    return { redirectUrl: paymentUrl };
  }

  async createVnpayUrl(
    orderId: string,
    totalPrice: number,
    ipAddr: string,
  ): Promise<{ redirectUrl: string }> {
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalPrice || 0,
      vnp_IpAddr: ipAddr || '',
      vnp_TxnRef: orderId || '',
      vnp_OrderInfo: `Payment for order ${orderId}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL!,
      vnp_Locale: VnpLocale.VN,
    });

    return { redirectUrl: paymentUrl };
  }

  async handleReturn(query: ReturnQueryFromVNPay) {
    const verify = vnpay.verifyReturnUrl(query);

    try {
      const order = await this.orderService.interalFindOrderById(
        verify.vnp_TxnRef,
      );
      if (order && order !== null) {
        if (verify.isSuccess) {
          await this.orderService.onPaymentSuccess(order);
          await this.paymentRepository.create({
            userId: order.userId,
            transactionId: verify.vnp_TransactionNo,
            transactionCode: verify.vnp_TxnRef,
            paymentMethod: 'VNPAY',
          });
          return { success: true, orderId: order._id };
        } else {
          await this.orderService.onPaymentFail(order);
          return { success: false, orderId: order._id };
        }
      } else {
        const transaction = await this.transactionService.findTransactionById(
          verify.vnp_TxnRef,
        );
        if (transaction && transaction !== null) {
          if (verify.isSuccess) {
            const userId =
              await this.transactionService.onPaymentSuccess(transaction);
            await this.paymentRepository.create({
              userId,
              transactionId: verify.vnp_TransactionNo,
              transactionCode: verify.vnp_TxnRef,
              paymentMethod: 'VNPAY',
            });
            return { success: true, walletId: transaction.walletId };
          } else {
            await this.transactionService.onPaymentFail(transaction);
            return { success: false, walletId: transaction.walletId };
          }
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Payment return processing error:', error);
      return { success: false, orderId: null };
    }
  }

  async handleIpn(query: ReturnQueryFromVNPay) {
    const verify = vnpay.verifyIpnCall(query);

    if (!verify.isVerified)
      return { RspCode: '97', Message: 'Invalid signature' };
    if (!verify.isSuccess) return { RspCode: '00', Message: 'Confirm success' };

    const order = await this.orderService.findOrderById(verify.vnp_TxnRef);
    if (!order) return { RspCode: '01', Message: 'Order not found' };
    if (order.paymentStatus !== PaymentStatus.PENDING)
      return { RspCode: '02', Message: 'Already confirmed' };

    await this.orderService.onPaymentSuccess(order);

    return { RspCode: '00', Message: 'Confirm success' };
  }

  async deletePayment(id: string) {
    return await this.paymentRepository.deleteById(id);
  }
}
