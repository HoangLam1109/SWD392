import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ITransaction {
  walletId: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  refId: string;
  description?: string;
  status?: string;
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
    enum: ['DEPOSIT', 'PAYMENT'],
  })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  balanceBefore: number;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop()
  description?: string;

  @Prop({ required: true })
  refId: string;

  @Prop({
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
  })
  status?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
