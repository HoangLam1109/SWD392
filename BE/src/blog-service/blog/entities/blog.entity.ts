import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BlogStatus } from '../enum/blog.enum';

export interface IBlog {
  title: string;
  content: string;
  thumbnailUrl?: string;
  status: BlogStatus;
  viewCount: number;
  publishedAt?: Date;
  userId: string;
  deletedAt?: Date;
}

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ default: null })
  thumbnailUrl: string;

  @Prop({ enum: BlogStatus, default: BlogStatus.DRAFT })
  status: BlogStatus;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: null })
  publishedAt: Date;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ default: null })
  deletedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
