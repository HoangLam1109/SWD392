import { Model } from 'mongoose';
import { IGame, Game, GameDocument } from '../entities/game.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IGameRepository {
  findById(id: string, fields?: string): Promise<GameDocument | null>;
  getGameBasicInfo(
    id: string,
  ): Promise<{ title: string; price: number; isActive: boolean } | null>;
  findByReleaseDate(releaseDate: Date): Promise<GameDocument | null>;
  findByPrice(price: number): Promise<GameDocument | null>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  searchByTitle(
    keyword: string,
    limit: number,
    fields?: string,
  ): Promise<GameDocument[]>;
  findAll(): Promise<GameDocument[]>;
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
        '_id title price discount isActive description developer publisher thumbnail coverImage releaseDate url',
    );
  }

  async getGameBasicInfo(
    id: string,
  ): Promise<{ title: string; price: number; isActive: boolean } | null> {
    return await this.gameModel.findById(id, 'title price isActive');
  }

  async findByReleaseDate(releaseDate: Date): Promise<GameDocument | null> {
    return await this.gameModel.findOne({ releaseDate });
  }

  async findByPrice(price: number): Promise<GameDocument | null> {
    return await this.gameModel.findOne({ price });
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
      .findByIdAndUpdate(id, userData, { new: true })
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
}
