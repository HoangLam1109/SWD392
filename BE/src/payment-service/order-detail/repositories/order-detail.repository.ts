import { Model } from 'mongoose';
import {
  IOrderDetail,
  OrderDetail,
  OrderDetailDocument,
} from '../entities/order-detail.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IOrderDetailRepository {
  findById(id: string, fields?: string): Promise<OrderDetailDocument | null>;
  findByIds(ids: string[]): Promise<OrderDetailDocument[]>;
  findByOrderId(orderId: string): Promise<OrderDetailDocument[]>;
  create(orderDetailData: Partial<IOrderDetail>): Promise<OrderDetailDocument>;
  updateById(
    id: string,
    orderDetailData: Partial<IOrderDetail>,
  ): Promise<OrderDetailDocument | null>;
  deleteManyByOrderId(orderId: string): Promise<void>;
  deleteById(id: string): Promise<OrderDetailDocument | null>;
  findAll(): Promise<OrderDetailDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<OrderDetailDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class OrderDetailRepository implements IOrderDetailRepository {
  constructor(
    @InjectModel(OrderDetail.name, 'PAYMENT_DB')
    private orderDetailModel: Model<OrderDetailDocument>,
  ) {}

  async findById(
    id: string,
    fields?: string,
  ): Promise<OrderDetailDocument | null> {
    return await this.orderDetailModel.findById(
      id,
      fields || 'orderId productId priceAtPurchase discount orderType',
    );
  }

  async findByIds(ids: string[]): Promise<OrderDetailDocument[]> {
    return await this.orderDetailModel
      .find({ _id: { $in: ids } })
      .populate('orderId')
      .populate('productId');
  }

  async findByOrderId(orderId: string): Promise<OrderDetailDocument[]> {
    return await this.orderDetailModel
      .find({ orderId })
      .populate('orderId')
      .populate('productId');
  }

  async create(
    orderDetailData: Partial<IOrderDetail>,
  ): Promise<OrderDetailDocument> {
    const orderDetail = new this.orderDetailModel(orderDetailData);
    return await orderDetail.save();
  }

  async updateById(
    id: string,
    orderDetailData: Partial<IOrderDetail>,
  ): Promise<OrderDetailDocument | null> {
    return await this.orderDetailModel
      .findByIdAndUpdate(id, orderDetailData, { new: true })
      .orFail(new NotFoundException('Order detail not found'))
      .exec();
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.orderDetailModel.deleteMany({ orderId });
  }

  async deleteById(id: string): Promise<OrderDetailDocument | null> {
    return await this.orderDetailModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Order detail not found'))
      .exec();
  }

  async findAll(): Promise<OrderDetailDocument[]> {
    return await this.orderDetailModel
      .find({}, 'orderId productId priceAtPurchase discount orderType')
      .populate('orderId')
      .populate('productId');
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<OrderDetailDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.orderDetailModel
      .find(query)
      .populate('orderId')
      .populate('productId')
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.orderDetailModel.countDocuments(query);
  }
}
