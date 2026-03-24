import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IUserGameItem {
  userId: string;
  itemId: string;
  isEquipped: boolean;
  quantity: number;
}

export type UserGameItemDocument = HydratedDocument<UserGameItem>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class UserGameItem {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, ref: 'GameItem' })
  itemId: string;

  @Prop({ required: true, default: false })
  isEquipped: boolean;

  @Prop({ required: true, default: 1 })
  quantity: number;
}

export const UserGameItemSchema = SchemaFactory.createForClass(UserGameItem);
