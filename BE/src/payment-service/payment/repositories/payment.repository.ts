import { Model } from 'mongoose';
import { IPayment, Payment, PaymentDocument } from '../entities/payment.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IPaymentRepository {
  findById(id: string): Promise<PaymentDocument | null>;
  findByCode(code: string): Promise<PaymentDocument | null>;
  create(paymentData: any): Promise<PaymentDocument>;
  updateById(id: string, paymentData: any): Promise<PaymentDocument | null>;
  deleteById(id: string): Promise<PaymentDocument | null>;
  findAll(): Promise<PaymentDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<PaymentDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(
    @InjectModel(Payment.name, 'PAYMENT_DB')
    private paymentModel: Model<PaymentDocument>,
  ) {}

  async findById(id: string): Promise<PaymentDocument | null> {
    return await this.paymentModel.findById(id);
  }

  async findByCode(code: string): Promise<PaymentDocument | null> {
    return await this.paymentModel.findOne({ code });
  }

  async create(paymentData: any): Promise<PaymentDocument> {
    const payment = new this.paymentModel(paymentData);
    return await payment.save();
  }

  async updateById(
    id: string,
    paymentData: Partial<IPayment>,
  ): Promise<PaymentDocument | null> {
    return await this.paymentModel
      .findByIdAndUpdate(id, paymentData, { new: true })
      .orFail(new NotFoundException('Payment not found'))
      .exec();
  }

  async deleteById(id: string): Promise<PaymentDocument | null> {
    return await this.paymentModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('Payment not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<PaymentDocument[]> {
    return await this.paymentModel.find({}, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<PaymentDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.paymentModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.paymentModel.countDocuments(query);
  }
}
