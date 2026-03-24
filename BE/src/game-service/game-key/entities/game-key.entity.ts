import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { KeyStatus } from '../enum/key-status.enum';

export interface IGameKey {
  gameId: string;
  keyCode: string;
  status: string;
  libraryGameId?: string;
  assignedAt?: Date;
  activatedAt?: Date;
}

export type GameKeyDocument = HydratedDocument<GameKey>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class GameKey {
  @Prop({ required: true, ref: 'Game' })
  gameId: string;

  @Prop({ required: true, unique: true })
  keyCode: string;

  @Prop({ enum: KeyStatus })
  status: string;

  @Prop()
  libraryGameId?: string;

  @Prop()
  assignedAt?: Date;

  @Prop()
  activatedAt?: Date;
}

export const GameKeySchema = SchemaFactory.createForClass(GameKey);
