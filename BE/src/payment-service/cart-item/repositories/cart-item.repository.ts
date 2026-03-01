import { Model } from 'mongoose';
import {
  ICartItem,
  CartItem,
  CartItemDocument,
} from '../entities/cart-item.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface ICartItemRepository {
  findById(id: string, fields?: string): Promise<CartItemDocument | null>;
  findByCartId(cartId: string): Promise<CartItemDocument[]>;
  create(cartItemData: Partial<ICartItem>): Promise<CartItemDocument>;
  updateById(
    id: string,
    cartItemData: Partial<ICartItem>,
  ): Promise<CartItemDocument | null>;
  deleteManyByCartId(cartId: string): Promise<void>;
  deleteById(id: string): Promise<CartItemDocument | null>;
  findAll(): Promise<CartItemDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<CartItemDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class CartItemRepository implements ICartItemRepository {
  constructor(
    @InjectModel(CartItem.name, 'PAYMENT_DB')
    private cartItemModel: Model<CartItemDocument>,
  ) {}

  async findById(
    id: string,
    fields?: string,
  ): Promise<CartItemDocument | null> {
    return await this.cartItemModel.findById(
      id,
      fields || 'cartId gameId priceAtPurchase',
    );
  }

  async findByCartId(cartId: string): Promise<CartItemDocument[]> {
    return await this.cartItemModel.find({ cartId }).populate('gameId');
  }

  async create(cartItemData: Partial<ICartItem>): Promise<CartItemDocument> {
    const cartItem = new this.cartItemModel(cartItemData);
    return await cartItem.save();
  }

  async updateById(
    id: string,
    cartItemData: Partial<ICartItem>,
  ): Promise<CartItemDocument | null> {
    return await this.cartItemModel
      .findByIdAndUpdate(id, cartItemData, { new: true })
      .orFail(new NotFoundException('Cart item not found'))
      .exec();
  }

  async deleteManyByCartId(cartId: string): Promise<void> {
    await this.cartItemModel.deleteMany({ cartId });
  }

  async deleteById(id: string): Promise<CartItemDocument | null> {
    return await this.cartItemModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Cart item not found'))
      .exec();
  }

  async findAll(): Promise<CartItemDocument[]> {
    return await this.cartItemModel
      .find({}, 'cartId gameId priceAtPurchase')
      .populate('gameId');
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<CartItemDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.cartItemModel
      .find(query)
      .populate('gameId')
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.cartItemModel.countDocuments(query);
  }
}
