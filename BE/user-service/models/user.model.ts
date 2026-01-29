import mongoose, { type InferSchemaType } from 'mongoose';
import { UserAccountType } from '../../shared/constants/role.constant';

export interface IUser extends Document {
  _id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role?: UserAccountType;
  avatar?: string;
  status: string;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserAccountType),
    },
    avatar: { type: String },
    status: { type: String, default: 'ACTIVE' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (
        _doc: unknown,
        ret: Record<string, unknown> & {
          _id?: unknown;
          id?: string;
        },
      ) => {
        ret.id = String(ret._id);
        delete ret._id;
      },
    },
  },
);

export type UserDocument = mongoose.HydratedDocument<InferSchemaType<typeof userSchema>>;
export const User = mongoose.model('User', userSchema);
