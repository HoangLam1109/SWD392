import mongoose, { type InferSchemaType } from 'mongoose';
import { UserAccountType } from '../interfaces/User';
import { capitalizeFirstLetter } from '../utils';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    accountType: {
      type: String,
      required: true,
      enum: Object.values(UserAccountType),
    },
    primaryPhone: { type: String },
    secondaryPhone: { type: String },
    deletedAt: { type: Date, default: null },
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
