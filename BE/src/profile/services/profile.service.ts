import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileDocument } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfileById(id: string): Promise<ProfileDocument> {
    const profile = await this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async getProfileByUserId(userId: string): Promise<ProfileDocument> {
    const profile = await this.profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found for this user');
    }
    return profile;
  }

  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    const existingProfile = await this.profileRepository.findById(id);
    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updateData: any = {
      ...updateProfileDto,
      dateOfBirth: updateProfileDto.dateOfBirth
        ? new Date(updateProfileDto.dateOfBirth)
        : undefined,
    };

    if (updateProfileDto.socialLinks) {
      updateData.socialLinks = {
        ...existingProfile.socialLinks,
        ...updateProfileDto.socialLinks,
      };
    }

    return this.profileRepository.updateById(id, updateData);
  }
}
