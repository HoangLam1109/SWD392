import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameItemType } from '../enum/type.enum';

export interface IGameItem {
  gameId: string;
  itemName: string;
  itemType: string;
  price: number;
  discount?: number;
  description?: string;
  url?: string;
  isAvailable: boolean;
  effectData: Record<string, any>;
}

export type GameItemDocument = HydratedDocument<GameItem>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class GameItem {
  @Prop({ required: true, ref: 'Game' })
  gameId: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true, enum: GameItemType })
  itemType: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  discount?: number;

  @Prop()
  description?: string;

  @Prop()
  url?: string;

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  @Prop({ type: Object })
  effectData: Record<string, any>;
}

export const GameItemSchema = SchemaFactory.createForClass(GameItem);
