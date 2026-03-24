import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IGame {
  title: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
  discount?: number;
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  url?: string;
}

export type GameDocument = HydratedDocument<Game>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Game {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, ref: 'Category' })
  categoryId: string;

  @Prop()
  description?: string;

  @Prop()
  thumbnail?: string;

  @Prop({ default: null })
  coverImage?: string;

  @Prop({ default: 0 })
  discount?: number;

  @Prop()
  developer?: string;

  @Prop()
  publisher?: string;

  @Prop()
  releaseDate?: Date;

  @Prop()
  url?: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
