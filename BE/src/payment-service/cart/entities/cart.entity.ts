import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface ICart {
  userId: string;
  itemId: string[];
}

export type CartDocument = HydratedDocument<ICart>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Cart {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'CartItem' })
  itemId: string[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
