import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IPayment {
  userId: string;
  transactionId: string;
  transactionCode: string;
  paymentMethod: string;
}

export type PaymentDocument = HydratedDocument<IPayment>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Payment {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, ref: 'Transaction' })
  transactionId: string;

  @Prop({ required: true })
  transactionCode: string;

  @Prop({ required: true })
  paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
