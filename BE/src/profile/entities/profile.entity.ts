import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Sex } from '../enum/profile.enum';

export interface ISocialLinks {
  facebook?: string;
  discord?: string;
  youtube?: string;
}

export interface IProfile {
  userId: Types.ObjectId;
  bio?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  socialLinks?: ISocialLinks;
  dateOfBirth?: Date;
  sex?: string;
}

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Profile {
  @Prop({ required: true, unique: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  phoneNumber: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  country: string;

  @Prop({
    type: {
      facebook: { type: String, default: null },
      discord: { type: String, default: null },
      youtube: { type: String, default: null },
    },
    default: {},
  })
  socialLinks: ISocialLinks;

  @Prop({ default: null })
  dateOfBirth: Date;

  @Prop({ enum: Sex, default: null })
  sex: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
