import { Model } from 'mongoose';
import { ICart, Cart, CartDocument } from '../entities/cart.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface ICartRepository {
  findById(id: string, fields?: string): Promise<CartDocument | null>;
  findByUserId(userId: string): Promise<CartDocument | null>;
  create(cartData: Partial<ICart>): Promise<CartDocument>;
  updateById(
    id: string,
    cartData: Partial<ICart>,
  ): Promise<CartDocument | null>;
  deleteById(id: string): Promise<CartDocument | null>;
  findAll(): Promise<CartDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<CartDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @InjectModel(Cart.name, 'PAYMENT_DB')
    private cartModel: Model<CartDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<CartDocument | null> {
    return await this.cartModel.findById(id, fields || 'userId itemId');
  }

  async findByUserId(userId: string): Promise<CartDocument | null> {
    return await this.cartModel.findOne({ userId }).populate('itemId');
  }

  async create(cartData: Partial<ICart>): Promise<CartDocument> {
    const cart = new this.cartModel(cartData);
    return await cart.save();
  }

  async updateById(
    id: string,
    cartData: Partial<ICart>,
  ): Promise<CartDocument | null> {
    return await this.cartModel
      .findByIdAndUpdate(id, cartData, { new: true })
      .orFail(new NotFoundException('Cart not found'))
      .exec();
  }

  async deleteById(id: string): Promise<CartDocument | null> {
    return await this.cartModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Cart not found'))
      .exec();
  }

  async findAll(): Promise<CartDocument[]> {
    return await this.cartModel.find({}, 'userId itemId').populate('itemId');
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<CartDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.cartModel
      .find(query)
      .populate('itemId')
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.cartModel.countDocuments(query);
  }
}
