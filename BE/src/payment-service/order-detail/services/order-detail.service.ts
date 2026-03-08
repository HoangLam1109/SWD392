import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailRepository } from '../repositories/order-detail.repository';
import { OrderDetailDocument } from '../entities/order-detail.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { ProductValidationService } from '../../../common/services/productValidation.service';
import { CartService } from '../../cart/services/cart.service';
import { CartItemService } from '../../cart-item/services/cart-item.service';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly paginationService: PaginationService,
    private readonly productValidationService: ProductValidationService,
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
  ) {}

  async createOrderDetail(
    createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetailDocument> {
    return await this.orderDetailRepository.create(createOrderDetailDto);
  }

  async convertItemsToOrderDetails(
    userId: string,
  ): Promise<{ orderDetails: OrderDetailDocument[]; totalPrice: number }> {
    const cartItems = await this.cartService.getAllCartItemsFromUserId(userId);
    if (!cartItems || !cartItems.itemId.length) {
      throw new NotFoundException('Cart items not found');
    }

    const orderDetails: OrderDetailDocument[] = [];

    const cartItemDocuments = await this.cartItemService.findCartItemsByIds(
      cartItems.itemId,
    );

    for (const cartItem of cartItemDocuments) {
      const { type } =
        await this.productValidationService.validateProductExists(
          cartItem.productId,
        );

      const orderDetailData = {
        orderId: '',
        productId: cartItem.productId,
        priceAtPurchase: cartItem.priceAtPurchase,
        discount: cartItem.discount,
        orderType: type === 'game' ? 'Game' : 'DLC',
      };

      const orderDetail =
        await this.orderDetailRepository.create(orderDetailData);
      orderDetails.push(orderDetail);
    }

    const totalPrice = await this.productValidationService.calculateTotalPrice(
      orderDetails.map((orderDetail) => orderDetail.productId),
    );
    return { orderDetails, totalPrice };
  }

  async findOrderDetailById(id: string): Promise<OrderDetailDocument> {
    const orderDetail = await this.orderDetailRepository.findById(id);
    if (!orderDetail) {
      throw new NotFoundException('Order detail not found');
    }
    return orderDetail;
  }

  async findOrderDetailsByOrderId(
    orderId: string,
  ): Promise<OrderDetailDocument[]> {
    return await this.orderDetailRepository.findByOrderId(orderId);
  }

  async findAll(): Promise<OrderDetailDocument[]> {
    return await this.orderDetailRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<OrderDetailDocument>> {
    return this.paginationService.paginate(this.orderDetailRepository, options);
  }

  async updateOrderDetail(
    id: string,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<OrderDetailDocument> {
    const existingOrderDetail = await this.orderDetailRepository.findById(id);
    if (!existingOrderDetail) {
      throw new NotFoundException('Order detail not found');
    }

    const updatedOrderDetail = await this.orderDetailRepository.updateById(
      id,
      updateOrderDetailDto,
    );
    if (!updatedOrderDetail) {
      throw new NotFoundException('Order detail not found');
    }
    return updatedOrderDetail;
  }

  async deleteOrderDetail(id: string): Promise<OrderDetailDocument> {
    const orderDetail = await this.orderDetailRepository.findById(id);
    if (!orderDetail) {
      throw new NotFoundException('Order detail not found');
    }
    const deletedOrderDetail = await this.orderDetailRepository.deleteById(id);
    if (!deletedOrderDetail) {
      throw new NotFoundException('Order detail not found');
    }
    return deletedOrderDetail;
  }

  async deleteOrderDetailsByOrderId(orderId: string): Promise<void> {
    await this.orderDetailRepository.deleteManyByOrderId(orderId);
  }
}
