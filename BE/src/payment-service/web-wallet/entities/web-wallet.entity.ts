import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IWebWallet {
  userId: string;
  balance: number;
  currency: string;
  status: string;
}

export type WebWalletDocument = HydratedDocument<IWebWallet>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class WebWallet {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true, default: 'ACTIVED', enum: ['ACTIVED', 'INACTIVED'] })
  status: string;
}

export const WebWalletSchema = SchemaFactory.createForClass(WebWallet);
