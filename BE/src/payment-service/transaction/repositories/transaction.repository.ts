import { Model } from 'mongoose';
import {
  ITransaction,
  Transaction,
  TransactionDocument,
} from '../entities/transaction.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface ITransactionRepository {
  findById(id: string): Promise<TransactionDocument | null>;
  findByRefId(refId: string): Promise<TransactionDocument | null>;
  findByWalletId(walletId: string): Promise<TransactionDocument[]>;
  create(transactionData: any): Promise<TransactionDocument>;
  updateById(
    id: string,
    transactionData: any,
  ): Promise<TransactionDocument | null>;
  deleteById(id: string): Promise<TransactionDocument | null>;
  findAll(): Promise<TransactionDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<TransactionDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectModel(Transaction.name, 'PAYMENT_DB')
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async findById(id: string): Promise<TransactionDocument | null> {
    return await this.transactionModel.findById(id);
  }

  async findByRefId(refId: string): Promise<TransactionDocument | null> {
    return await this.transactionModel.findOne({ refId });
  }

  async findByWalletId(walletId: string): Promise<TransactionDocument[]> {
    return await this.transactionModel.find({ walletId });
  }

  async create(transactionData: any): Promise<TransactionDocument> {
    const transaction = new this.transactionModel(transactionData);
    return await transaction.save();
  }

  async updateById(
    id: string,
    transactionData: Partial<ITransaction>,
  ): Promise<TransactionDocument | null> {
    return await this.transactionModel
      .findByIdAndUpdate(id, transactionData, { new: true })
      .orFail(new NotFoundException('Transaction not found'))
      .exec();
  }

  async deleteById(id: string): Promise<TransactionDocument | null> {
    return await this.transactionModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Transaction not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<TransactionDocument[]> {
    return await this.transactionModel.find({}, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<TransactionDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.transactionModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.transactionModel.countDocuments(query);
  }
}
