import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export interface ICategory {
  categoryName: string;
  description?: string;
  parentCategoryId?: string;
  gameId: string;
}

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false,
  },
})
export class Category {
  @Prop({ required: true })
  categoryName: string;

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ default: null, type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  parentCategoryId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Game' })
  gameId: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
