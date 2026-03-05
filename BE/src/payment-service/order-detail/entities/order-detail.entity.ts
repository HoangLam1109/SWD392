import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IOrderDetail {
  orderId?: string;
  productId: string;
  totalPrice: number;
  discount: number;
  orderType: string;
}

export type OrderDetailDocument = HydratedDocument<IOrderDetail>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class OrderDetail {
  @Prop({ ref: 'Order' })
  orderId?: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true, enum: ['Game', 'DLC'] })
  orderType: string;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
