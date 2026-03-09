import { Model } from 'mongoose';
import {
  IGameItem,
  GameItem,
  GameItemDocument,
} from '../entities/game-item.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IGameItemRepository {
  findById(id: string): Promise<GameItemDocument | null>;
  create(gameItemData: any): Promise<GameItemDocument>;
  updateById(id: string, gameItemData: any): Promise<GameItemDocument | null>;
  deleteById(id: string): Promise<GameItemDocument | null>;
  findAll(): Promise<GameItemDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<GameItemDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class GameItemRepository implements IGameItemRepository {
  constructor(
    @InjectModel(GameItem.name, 'GAME_DB')
    private gameItemModel: Model<GameItemDocument>,
  ) {}

  async findById(id: string): Promise<GameItemDocument | null> {
    return await this.gameItemModel.findById(id);
  }

  async create(gameItemData: any): Promise<GameItemDocument> {
    const gameItem = new this.gameItemModel(gameItemData);
    return await gameItem.save();
  }

  async updateById(
    id: string,
    gameItemData: Partial<IGameItem>,
  ): Promise<GameItemDocument | null> {
    return await this.gameItemModel
      .findByIdAndUpdate(id, gameItemData, { new: true })
      .orFail(new NotFoundException('Game item not found'))
      .exec();
  }

  async deleteById(id: string): Promise<GameItemDocument | null> {
    return await this.gameItemModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Game item not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<GameItemDocument[]> {
    return await this.gameItemModel.find({}, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<GameItemDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.gameItemModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.gameItemModel.countDocuments(query);
  }
}
