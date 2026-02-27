import { Model } from 'mongoose';
import {
  IWebWallet,
  WebWallet,
  WebWalletDocument,
} from '../entities/web-wallet.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IWebWalletRepository {
  findById(id: string): Promise<WebWalletDocument | null>;
  create(walletData: any): Promise<WebWalletDocument>;
  findByUserId(userId: string): Promise<WebWalletDocument | null>;
  updateById(id: string, walletData: any): Promise<WebWalletDocument | null>;
  deleteById(id: string): Promise<WebWalletDocument | null>;
  findAll(): Promise<WebWalletDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<WebWalletDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class WebWalletRepository implements IWebWalletRepository {
  constructor(
    @InjectModel(WebWallet.name, 'PAYMENT_DB')
    private webWalletModel: Model<WebWalletDocument>,
  ) {}

  async findById(id: string): Promise<WebWalletDocument | null> {
    return await this.webWalletModel.findById(id);
  }

  async create(walletData: any): Promise<WebWalletDocument> {
    const wallet = new this.webWalletModel(walletData);
    return await wallet.save();
  }

  async findByUserId(userId: string): Promise<WebWalletDocument | null> {
    return await this.webWalletModel.findOne({ userId });
  }

  async updateById(
    id: string,
    walletData: Partial<IWebWallet>,
  ): Promise<WebWalletDocument | null> {
    return await this.webWalletModel
      .findByIdAndUpdate(id, walletData, { new: true })
      .orFail(new NotFoundException('WebWallet not found'))
      .exec();
  }

  async deleteById(id: string): Promise<WebWalletDocument | null> {
    return await this.webWalletModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('WebWallet not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<WebWalletDocument[]> {
    return await this.webWalletModel.find({}, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<WebWalletDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.webWalletModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.webWalletModel.countDocuments(query);
  }
}
