import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { RequirementType } from '../enum/requirement.enum';

export interface ISystemRequirement {
  gameId: string;
  requirementType: RequirementType;
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
  additionalNotes?: string;
}

export type SystemRequirementDocument = HydratedDocument<SystemRequirement>;

@Schema({
  timestamps: false,
})
export class SystemRequirement {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Game' })
  gameId: string;

  @Prop({ enum: RequirementType, required: true })
  requirementType: RequirementType;

  @Prop({ required: true })
  os: string;

  @Prop({ required: true })
  processor: string;

  @Prop({ required: true })
  memory: string;

  @Prop({ required: true })
  graphics: string;

  @Prop({ required: true })
  storage: string;

  @Prop({ type: String, default: null })
  additionalNotes: string;
}

export const SystemRequirementSchema =
  SchemaFactory.createForClass(SystemRequirement);
