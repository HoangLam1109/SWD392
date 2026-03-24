import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ICartItem {
  cartId: string;
  productId: string;
  priceAtPurchase: number;
  discount: number;
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

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  priceAtPurchase: number;

  @Prop({ required: true })
  discount: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
