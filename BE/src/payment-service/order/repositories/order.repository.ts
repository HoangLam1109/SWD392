import { Model } from 'mongoose';
import { IOrder, Order, OrderDocument } from '../entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IOrderRepository {
  findById(id: string, fields?: string): Promise<OrderDocument | null>;
  findByUserId(userId: string): Promise<OrderDocument[]>;
  findByOrderDetailId(orderDetailId: string): Promise<OrderDocument[]>;
  create(orderData: Partial<IOrder>): Promise<OrderDocument>;
  updateById(
    id: string,
    orderData: Partial<IOrder>,
  ): Promise<OrderDocument | null>;
  updateManyById(
    ids: string[],
    orderData: Partial<IOrder>,
  ): Promise<OrderDocument[]>;
  deleteById(id: string): Promise<OrderDocument | null>;
  deleteManyByUserId(userId: string): Promise<void>;
  findAll(): Promise<OrderDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<OrderDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name, 'PAYMENT_DB')
    private orderModel: Model<OrderDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<OrderDocument | null> {
    return await this.orderModel.findById(
      id,
      fields ||
        'userId walletTransactionId orderDetailId totalPrice paymentStatus',
    );
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    return await this.orderModel
      .find({ userId })
      .populate('userId')
      .populate('orderDetailId')
      .sort({ created_at: -1 });
  }

  async findByOrderDetailId(orderDetailId: string): Promise<OrderDocument[]> {
    return await this.orderModel
      .find({ orderDetailId })
      .populate('userId')
      .populate('orderDetailId')
      .sort({ created_at: -1 });
  }

  async create(orderData: Partial<IOrder>): Promise<OrderDocument> {
    const order = new this.orderModel(orderData);
    return await order.save();
  }

  async updateById(
    id: string,
    orderData: Partial<IOrder>,
  ): Promise<OrderDocument | null> {
    return await this.orderModel
      .findByIdAndUpdate(id, orderData, { returnDocument: 'after' })
      .orFail(new NotFoundException('Order not found'))
      .exec();
  }

  async updateManyById(
    ids: string[],
    orderData: Partial<IOrder>,
  ): Promise<OrderDocument[]> {
    await this.orderModel.updateMany(
      { _id: { $in: ids } },
      { $set: orderData },
    );

    return await this.orderModel.find({ _id: { $in: ids } });
  }

  async deleteById(id: string): Promise<OrderDocument | null> {
    return await this.orderModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Order not found'))
      .exec();
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.orderModel.deleteMany({ userId });
  }

  async findAll(): Promise<OrderDocument[]> {
    return await this.orderModel
      .find(
        {},
        'userId walletTransactionId orderDetailId totalPrice paymentStatus',
      )
      .populate('userId')
      .populate('orderDetailId')
      .sort({ created_at: -1 });
  }

  async findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<OrderDocument[] | undefined> {
    const sortField = options?.sortBy || 'created_at';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    return await this.orderModel
      .find(query)
      .populate('userId')
      .populate('orderDetailId')
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.orderModel.countDocuments(query);
  }
}
