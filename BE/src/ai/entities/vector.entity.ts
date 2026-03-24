import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IVector {
  fileId: string;
  vector: number[];
  pageContent: string;
}

export type VectorDocument = HydratedDocument<Vector>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Vector {
  @Prop({ required: true })
  fileId: string;

  @Prop({ required: true })
  vector: number[];

  @Prop({ required: true })
  pageContent: string;
}

export const VectorSchema = SchemaFactory.createForClass(Vector);
