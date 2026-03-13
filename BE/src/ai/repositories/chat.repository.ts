import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../entities/chat.entity';

export interface IChatRepository {
  create(chatData: Partial<Chat>): Promise<ChatDocument>;
  findBySessionId(sessionId: string, limit?: number): Promise<ChatDocument[]>;
  findByUserId(userId: string, limit?: number): Promise<ChatDocument[]>;
  deleteBySessionId(sessionId: string): Promise<void>;
}

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel(Chat.name, 'AI_DB')
    private readonly chatModel: Model<Chat>,
  ) {}

  async create(chatData: Partial<Chat>): Promise<ChatDocument> {
    return await this.chatModel.create(chatData);
  }

  async findBySessionId(
    sessionId: string,
    limit: number = 10,
  ): Promise<ChatDocument[]> {
    return await this.chatModel
      .find({ sessionId })
      .sort({ created_at: 1 })
      .limit(limit);
  }

  async findByUserId(
    userId: string,
    limit: number = 20,
  ): Promise<ChatDocument[]> {
    return await this.chatModel
      .find({ userId })
      .sort({ created_at: -1 })
      .limit(limit);
  }

  async deleteBySessionId(sessionId: string): Promise<void> {
    await this.chatModel.deleteMany({ sessionId });
  }
}
