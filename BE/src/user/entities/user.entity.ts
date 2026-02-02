import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole, UserStatus } from '../enum/user.enum';

export interface IUser {
  email: string;
  passwordHash: string;
  fullName: string;
  avatar?: string;
  status?: string;
  role?: string;
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, minLength: 2, maxLength: 32 })
  fullName: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: string;

  @Prop({ enum: UserRole, default: UserRole.PLAYER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
