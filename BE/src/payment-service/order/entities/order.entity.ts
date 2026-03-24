import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IOrder {
  userId: string;
  walletTransactionId: string;
  orderDetailId: string;
  totalPrice: number;
  paymentStatus: string;
  completedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'WalletTransaction' })
  walletTransactionId: string;

  @Prop({ required: true, ref: 'OrderDetail' })
  orderDetailId: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  paymentStatus: string;

  @Prop({ required: true })
  completedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
