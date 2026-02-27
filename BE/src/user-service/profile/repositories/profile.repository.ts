import { Model, Types } from 'mongoose';
import { IProfile, Profile, ProfileDocument } from '../entities/profile.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export interface IProfileRepository {
  findById(id: string): Promise<ProfileDocument | null>;
  findByUserId(userId: string): Promise<ProfileDocument | null>;
  updateById(id: string, profileData: any): Promise<ProfileDocument | null>;
}

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(
    @InjectModel(Profile.name, 'USER_DB')
    private profileModel: Model<ProfileDocument>,
  ) {}

  async findById(id: string): Promise<ProfileDocument | null> {
    return await this.profileModel.findById(id);
  }

  async findByUserId(userId: string): Promise<ProfileDocument | null> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  return this.profileModel.findOne({
    userId: new Types.ObjectId(userId),
  });
}


  async updateById(
    id: string,
    profileData: Partial<IProfile>,
  ): Promise<ProfileDocument> {
    return this.profileModel
      .findByIdAndUpdate(id, profileData, { new: true })
      .orFail(new NotFoundException('Profile not found'))
      .exec();
  }

  async upsertByUserId(
  userId: string,
  data: any,
): Promise<ProfileDocument> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  return this.profileModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {
      ...data,
      userId: new Types.ObjectId(userId),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
}
}
