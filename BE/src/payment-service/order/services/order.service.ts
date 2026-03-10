import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { OrderDocument } from '../entities/order.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { TransactionService } from '../../transaction/services/transaction.service';
import { OrderDetailService } from '../../order-detail/services/order-detail.service';
import { CartService } from '../../cart/services/cart.service';
import { TransactionStatus } from '../../transaction/enum/transaction.enum';
import { PaymentStatus } from '../enum/status.enum';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paginationService: PaginationService,
    private readonly cartService: CartService,
    private readonly transactionService: TransactionService,
    private readonly orderDetailService: OrderDetailService,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderDocument> {
    return await this.orderRepository.create({ ...createOrderDto, userId });
  }

  async checkout(userId: string): Promise<Partial<OrderDocument> | null> {
    await this.findAndCancelPendingOrdersByUserId(userId);

    const { orderDetails, totalPrice } =
      await this.orderDetailService.convertItemsToOrderDetails(userId);
    if (!orderDetails || !orderDetails.length) {
      throw new NotFoundException('Order details not found');
    }

    const order = await this.orderRepository.create({
      userId,
      orderDetailId: orderDetails.map((orderDetail) => orderDetail.id),
      walletTransactionId: '',
      totalPrice,
      paymentStatus: PaymentStatus.PENDING,
    });

    for (const orderDetail of orderDetails) {
      await this.orderDetailService.updateOrderDetail(orderDetail.id, {
        orderId: order.id,
      });
    }

    if (await this.transactionService.checkUserBalance(userId, totalPrice)) {
      const transaction = await this.transactionService.purchaseWithUserId(
        userId,
        order.id,
        totalPrice,
      );

      await this.orderDetailService.convertOrderDetailsToGameItems(
        order.id,
        userId,
      );

      return await this.updateOrder(order.id, {
        walletTransactionId: transaction.id,
        paymentStatus: PaymentStatus.COMPLETED,
        completedAt: new Date(),
      });
    }

    return {
      _id: order._id,
      userId: order.userId,
      walletTransactionId: order.walletTransactionId,
      orderDetailId: order.orderDetailId,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      completedAt: order.completedAt,
    } as Partial<OrderDocument>;
  }

  async findOrderById(id: string): Promise<OrderDocument> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async interalFindOrderById(id: string): Promise<OrderDocument | null> {
    const order = await this.orderRepository.findById(id);
    return order || null;
  }

  async findOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    const orders = await this.orderRepository.findByUserId(userId);
    if (!orders) {
      throw new NotFoundException('Orders not found for this user');
    }
    return orders;
  }

  async findAndCancelPendingOrdersByUserId(
    userId: string,
  ): Promise<OrderDocument[]> {
    const orders = await this.orderRepository.findByUserId(userId);
    if (!orders) {
      throw new NotFoundException('Orders not found for this user');
    }
    const pending = orders.filter(
      (order) => order.paymentStatus === PaymentStatus.PENDING,
    );
    return this.orderRepository.updateManyById(
      pending.map((order) => order._id.toString()),
      {
        paymentStatus: PaymentStatus.CANCELLED,
      },
    );
  }

  async findAll(): Promise<OrderDocument[]> {
    return await this.orderRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<OrderDocument>> {
    return this.paginationService.paginate(this.orderRepository, options);
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<OrderDocument | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return await this.orderRepository.updateById(id, updateOrderDto);
  }

  async deleteOrder(id: string): Promise<OrderDocument | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return await this.orderRepository.deleteById(id);
  }

  async onPaymentSuccess(order: Partial<OrderDocument>) {
    if (!order._id) {
      throw new BadRequestException('Order ID is required');
    }

    const foundOrder = await this.findOrderById(order._id.toString());

    if (!foundOrder) {
      throw new NotFoundException('Order not found for current transaction');
    }

    const transaction = await this.transactionService.findByRefId(
      foundOrder.id,
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found for current order');
    }

    await this.transactionService.updateTransaction(transaction.id, {
      status: TransactionStatus.COMPLETED,
    });

    await this.updateOrder(foundOrder.id, {
      walletTransactionId: transaction.id,
      paymentStatus: PaymentStatus.COMPLETED,
      completedAt: new Date(),
    });

    await this.orderDetailService.convertOrderDetailsToGameItems(
      foundOrder.id,
      order.userId as string,
    );
    const cart = await this.cartService.findCartByUserId(
      order.userId as string,
    );
    await this.cartService.deleteCart(cart.id.toString());
  }

  async onPaymentFail(order: Partial<OrderDocument>) {
    if (!order._id) {
      throw new BadRequestException('Order ID is required');
    }

    const transaction = await this.transactionService.findByRefId(
      order._id.toString(),
    );
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    await this.transactionService.updateTransaction(transaction.id, {
      status: TransactionStatus.FAILED,
    });

    await this.updateOrder(order._id?.toString(), {
      walletTransactionId: transaction.id,
      paymentStatus: PaymentStatus.FAILED,
    });
  }
}
