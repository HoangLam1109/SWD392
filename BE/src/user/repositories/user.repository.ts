import { Model } from 'mongoose';
import { IUser, User, UserDocument } from '../entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IUserRepository {
  findById(id: string, fields?: string): Promise<any>;
  getUserBasicInfo(
    id: string,
  ): Promise<{ email: string; fullName: string } | null>;
  findByEmail(email: string): Promise<any>;
  findByPhoneNumber(identityNumber: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<UserDocument | null>;
  findAll(fields?: string): Promise<UserDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<UserDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name, 'USER_DB') private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<UserDocument | null> {
    return await this.userModel.findById(
      id,
      fields || '_id email fullName phoneNumber address role avatar status',
    );
  }

  async getUserBasicInfo(
    id: string,
  ): Promise<{ email: string; fullName: string; avatar?: string } | null> {
    return await this.userModel.findById(id, 'email fullName avatar');
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ phoneNumber });
  }

  async findOne(criteria: Partial<IUser>): Promise<UserDocument | null> {
    return await this.userModel.findOne(criteria);
  }

  async create(userData: any): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async updateById(
    id: string,
    userData: Partial<IUser>,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .orFail(new NotFoundException('User not found'))
      .exec();
  }

  async deleteById(id: string): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndDelete(id)
      .orFail(new NotFoundException('User not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<UserDocument[]> {
    return await this.userModel.find({}, fields);
  }

  async searchByFullName(
    keyword: string,
    fields?: string,
    limit: number = 20,
  ): Promise<UserDocument[]> {
    const regex = new RegExp(keyword, 'i');
    return await this.userModel
      .find({ fullName: regex }, fields)
      .limit(limit)
      .lean();
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<UserDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    return await this.userModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.userModel.countDocuments(query);
  }
}
