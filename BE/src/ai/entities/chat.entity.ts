import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IChat {
  sessionId: string;
  userId?: string;
  message: string;
  response: string;
  query: string;
  context: string;
}

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Chat {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userId?: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  response: string;

  @Prop({ required: true })
  query: string;

  @Prop({ required: true })
  context: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
