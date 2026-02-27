import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export interface IComment {
  content: string;
  blogId: string;
  userId: string;
  parentCommentId?: string;
  isDeleted: boolean;
}

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Comment {
  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Blog' })
  blogId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId, ref: 'Comment' })
  parentCommentId: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
