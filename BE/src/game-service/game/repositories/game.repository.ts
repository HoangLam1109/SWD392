import { Model } from 'mongoose';
import { IGame, Game, GameDocument } from '../entities/game.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IGameRepository {
  findById(id: string, fields?: string): Promise<GameDocument | null>;
  findByIds(ids: string[]): Promise<GameDocument[]>;
  getGameBasicInfo(
    id: string,
  ): Promise<{ title: string; price: number; isActive: boolean } | null>;
  findByReleaseDate(releaseDate: Date): Promise<GameDocument[] | null>;
  findByCategoryId(categoryId: string): Promise<GameDocument[] | null>;
  findByPrice(price: number): Promise<GameDocument[] | null>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  searchByTitle(
    keyword: string,
    limit: number,
    fields?: string,
  ): Promise<GameDocument[]>;
  findAll(): Promise<GameDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<GameDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectModel(Game.name, 'GAME_DB') private gameModel: Model<GameDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<GameDocument | null> {
    return await this.gameModel.findById(
      id,
      fields ||
        '_id title price discount isActive description developer publisher thumbnail coverImage releaseDate url categoryId',
    );
  }

  async findByIds(ids: string[]): Promise<GameDocument[]> {
    return await this.gameModel.find({ _id: { $in: ids } });
  }

  async getGameBasicInfo(
    id: string,
  ): Promise<{ title: string; price: number; isActive: boolean } | null> {
    return await this.gameModel.findById(id, 'title price isActive');
  }

  async findByReleaseDate(releaseDate: Date): Promise<GameDocument[] | null> {
    return await this.gameModel.find({ releaseDate });
  }

  async findByCategoryId(categoryId: string): Promise<GameDocument[] | null> {
    return await this.gameModel.find({ categoryId });
  }

  async findByPrice(price: number): Promise<GameDocument[] | null> {
    return await this.gameModel.find({ price });
  }

  async findAll(): Promise<GameDocument[]> {
    return await this.gameModel.find();
  }

  async create(userData: any): Promise<GameDocument> {
    const user = new this.gameModel(userData);
    return await user.save();
  }

  async updateById(
    id: string,
    userData: Partial<IGame>,
  ): Promise<GameDocument | null> {
    return await this.gameModel
      .findByIdAndUpdate(id, userData, { returnDocument: 'after' })
      .orFail(new NotFoundException('Game not found'))
      .exec();
  }

  async deleteById(id: string): Promise<GameDocument | null> {
    return await this.gameModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Game not found'))
      .exec();
  }

  async searchByTitle(
    keyword: string,
    limit: number = 20,
    fields?: string,
  ): Promise<GameDocument[]> {
    const regex = new RegExp(keyword, 'i');
    return await this.gameModel
      .find({ title: regex }, fields)
      .limit(limit)
      .lean();
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<GameDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.gameModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.gameModel.countDocuments(query);
  }
}
