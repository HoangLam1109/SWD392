import { Model } from 'mongoose';
import {
  IGameKey,
  GameKey,
  GameKeyDocument,
} from '../entities/game-key.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGameKeyInput } from '../../../common/types/key.type';
import { KeyStatus } from '../enum/key-status.enum';

export interface IGameKeyRepository {
  findById(id: string): Promise<GameKeyDocument | null>;
  findByKeyCode(keyCode: string): Promise<GameKeyDocument | null>;
  findByGameId(gameId: string): Promise<GameKeyDocument[]>;
  findAvailableKeys(gameId: string): Promise<GameKeyDocument[]>;
  findByOrderDetailId(orderDetailId: string): Promise<GameKeyDocument[]>;
  findByStatus(status: KeyStatus): Promise<GameKeyDocument[]>;
  create(gameKeyData: Partial<IGameKey>): Promise<GameKeyDocument>;
  createMany(gameKeyData: CreateGameKeyInput[]): Promise<GameKeyDocument[]>;
  updateById(
    id: string,
    gameKeyData: Partial<IGameKey>,
  ): Promise<GameKeyDocument | null>;
  updateByKeyCode(
    keyCode: string,
    gameKeyData: Partial<IGameKey>,
  ): Promise<GameKeyDocument | null>;
  deleteById(id: string): Promise<GameKeyDocument | null>;
  findAll(): Promise<GameKeyDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<GameKeyDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class GameKeyRepository implements IGameKeyRepository {
  constructor(
    @InjectModel(GameKey.name, 'GAME_DB')
    private gameKeyModel: Model<GameKeyDocument>,
  ) {}

  async findByGameId(gameId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel.find({ gameId }).sort({ created_at: -1 });
  }

  async findById(id: string): Promise<GameKeyDocument | null> {
    return await this.gameKeyModel.findById(id);
  }

  async findAvailableKeys(gameId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel
      .find({ gameId, status: KeyStatus.AVAILABLE })
      .sort({ created_at: -1 });
  }

  async findByKeyCode(keyCode: string): Promise<GameKeyDocument | null> {
    return await this.gameKeyModel.findOne({ keyCode });
  }

  async findByOrderDetailId(orderDetailId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel
      .find({ orderDetailId })
      .sort({ created_at: -1 });
  }

  async findByStatus(status: KeyStatus): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel.find({ status }).sort({ created_at: -1 });
  }

  async create(gameKeyData: Partial<IGameKey>): Promise<GameKeyDocument> {
    const gameKey = new this.gameKeyModel(gameKeyData);
    return await gameKey.save();
  }

  async createMany(
    gameKeyData: CreateGameKeyInput[],
  ): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel.insertMany(gameKeyData);
  }

  async updateById(
    id: string,
    gameKeyData: Partial<IGameKey>,
  ): Promise<GameKeyDocument | null> {
    return await this.gameKeyModel
      .findByIdAndUpdate(id, gameKeyData, { new: true })
      .exec();
  }

  async updateByKeyCode(
    keyCode: string,
    gameKeyData: Partial<IGameKey>,
  ): Promise<GameKeyDocument | null> {
    return await this.gameKeyModel
      .findOneAndUpdate({ keyCode }, gameKeyData, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<GameKeyDocument | null> {
    return await this.gameKeyModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<GameKeyDocument[]> {
    return await this.gameKeyModel.find({}).sort({ created_at: -1 });
  }

  async findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<GameKeyDocument[] | undefined> {
    const sortField = options?.sortBy || 'created_at';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    return await this.gameKeyModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.gameKeyModel.countDocuments(query);
  }
}
