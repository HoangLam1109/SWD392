import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ITransaction {
  walletId: string;
  transType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  refId: string;
  status: string;
}

export type TransactionDocument = HydratedDocument<ITransaction>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Transaction {
  @Prop({ required: true, ref: 'WebWallet' })
  walletId: string;

  @Prop({
    required: true,
    enum: ['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PAYMENT'],
  })
  transType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  balanceBefore: number;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  refId: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
