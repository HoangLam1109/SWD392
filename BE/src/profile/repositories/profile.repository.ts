import { Model } from 'mongoose';
import { IProfile, Profile, ProfileDocument } from '../entities/profile.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    return await this.profileModel.findOne({ userId });
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
}
