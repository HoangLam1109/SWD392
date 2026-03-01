import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ICartItem {
  cartId: string;
  gameId: string;
  priceAtPurchase: number;
}

export type CartItemDocument = HydratedDocument<ICartItem>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class CartItem {
  @Prop({ required: true, ref: 'Cart' })
  cartId: string;

  @Prop({ required: true, ref: 'Game' })
  gameId: string;

  @Prop({ required: true })
  priceAtPurchase: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
