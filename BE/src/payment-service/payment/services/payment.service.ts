import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentDocument } from '../entities/payment.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { OrderService } from 'src/payment-service/order/services/order.service';
import { PaymentStatus } from 'src/payment-service/order/enum/status.enum';
import { vnpay } from 'src/config/vnpay.config';
import { ProductCode, VnpLocale, ReturnQueryFromVNPay } from 'vnpay';
import { TransactionService } from 'src/payment-service/transaction/services/transaction.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paginationService: PaginationService,
    private readonly orderService: OrderService,
    private readonly transactionService: TransactionService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.create(createPaymentDto);
  }

  async findByCode(code: string) {
    return await this.paymentRepository.findByCode(code);
  }

  async findPaymentById(id: string) {
    return await this.paymentRepository.findById(id);
  }

  async findAll() {
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
    walletId: string,
    totalPrice: number,
    ipAddr: string,
  ): Promise<{ redirectUrl: string }> {
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalPrice || 0,
      vnp_IpAddr: ipAddr || '',
      vnp_TxnRef: walletId || '',
      vnp_OrderInfo: `Payment for deposit to ${walletId}`,
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
      const order = await this.orderService.findOrderById(verify.vnp_TxnRef);
      if (order) {
        if (verify.isSuccess) {
          await this.orderService.onPaymentSuccess(order);
          return { success: true, orderId: order._id };
        } else {
          await this.orderService.onPaymentFail(order);
          return { success: false, orderId: order._id };
        }
      } else {
        const transaction = await this.transactionService.findByRefId(
          verify.vnp_TxnRef,
        );
        if (transaction) {
          if (verify.isSuccess) {
            await this.transactionService.onPaymentSuccess(transaction);
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
