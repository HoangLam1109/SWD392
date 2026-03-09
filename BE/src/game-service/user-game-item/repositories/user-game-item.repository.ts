import { Model } from 'mongoose';
import {
  IUserGameItem,
  UserGameItem,
  UserGameItemDocument,
} from '../entities/user-game-item.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IUserGameItemRepository {
  findById(id: string, fields?: string): Promise<UserGameItemDocument | null>;
  findByUserId(userId: string): Promise<UserGameItemDocument[]>;
  findByItemId(itemId: string): Promise<UserGameItemDocument[]>;
  findByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<UserGameItemDocument | null>;
  create(
    userGameItemData: Partial<IUserGameItem>,
  ): Promise<UserGameItemDocument>;
  updateById(
    id: string,
    userGameItemData: Partial<IUserGameItem>,
  ): Promise<UserGameItemDocument | null>;
  deleteById(id: string): Promise<UserGameItemDocument | null>;
  deleteManyByUserId(userId: string): Promise<void>;
  findAll(): Promise<UserGameItemDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<UserGameItemDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class UserGameItemRepository implements IUserGameItemRepository {
  constructor(
    @InjectModel(UserGameItem.name, 'GAME_DB')
    private userGameItemModel: Model<UserGameItemDocument>,
  ) {}

  async findById(
    id: string,
    fields?: string,
  ): Promise<UserGameItemDocument | null> {
    return await this.userGameItemModel.findById(
      id,
      fields || 'userId itemId isEquipped quantity',
    );
  }

  async findByUserId(userId: string): Promise<UserGameItemDocument[]> {
    return await this.userGameItemModel
      .find({ userId })
      .sort({ created_at: -1 });
  }

  async findByItemId(itemId: string): Promise<UserGameItemDocument[]> {
    return await this.userGameItemModel
      .find({ itemId })
      .populate('userId')
      .populate('itemId')
      .sort({ created_at: -1 });
  }

  async findByUserAndItem(
    userId: string,
    itemId: string,
  ): Promise<UserGameItemDocument | null> {
    return await this.userGameItemModel
      .findOne({ userId, itemId })
      .populate('userId')
      .populate('itemId');
  }

  async create(
    userGameItemData: Partial<IUserGameItem>,
  ): Promise<UserGameItemDocument> {
    const userGameItem = new this.userGameItemModel(userGameItemData);
    return await userGameItem.save();
  }

  async updateById(
    id: string,
    userGameItemData: Partial<IUserGameItem>,
  ): Promise<UserGameItemDocument | null> {
    return await this.userGameItemModel
      .findByIdAndUpdate(id, userGameItemData, { new: true })
      .orFail(new NotFoundException('User game item not found'))
      .exec();
  }

  async deleteById(id: string): Promise<UserGameItemDocument | null> {
    return await this.userGameItemModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('User game item not found'))
      .exec();
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.userGameItemModel.deleteMany({ userId });
  }

  async findAll(): Promise<UserGameItemDocument[]> {
    return await this.userGameItemModel
      .find({}, 'userId itemId isEquipped quantity')
      .populate('userId')
      .populate('itemId')
      .sort({ created_at: -1 });
  }

  async findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<UserGameItemDocument[] | undefined> {
    const sortField = options?.sortBy || 'created_at';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    return await this.userGameItemModel
      .find(query)
      .populate('userId')
      .populate('itemId')
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.userGameItemModel.countDocuments(query);
  }
}
