import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PaymentStatus } from '../enum/status.enum';

export interface IOrder {
  userId: string;
  walletTransactionId?: string;
  orderDetailId: string[];
  totalPrice: number;
  paymentStatus: PaymentStatus;
  completedAt?: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop()
  walletTransactionId?: string;

  @Prop({ required: true, ref: 'OrderDetail' })
  orderDetailId: string[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    type: String,
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @Prop()
  completedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
