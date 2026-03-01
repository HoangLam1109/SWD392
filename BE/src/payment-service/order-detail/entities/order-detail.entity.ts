import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IOrderDetail {
  orderId: string;
  gameId: string[];
  totalPrice: number;
  discount: number;
}

export type OrderDetailDocument = HydratedDocument<IOrderDetail>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class OrderDetail {
  @Prop({ required: true, ref: 'Order' })
  orderId: string;

  @Prop({ required: true, ref: 'Game[]' })
  gameId: string[];

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  discount: number;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
