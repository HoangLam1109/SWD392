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
  userId: string,
  updateProfileDto: UpdateProfileDto,
): Promise<ProfileDocument> {

  const updateData: any = {
    bio: updateProfileDto.bio,
    phoneNumber: updateProfileDto.phoneNumber,
    address: updateProfileDto.address,
    country: updateProfileDto.country,
    sex: updateProfileDto.sex,
    dateOfBirth: updateProfileDto.dateOfBirth
      ? new Date(updateProfileDto.dateOfBirth)
      : undefined,
  };

  // 🔥 Merge socialLinks (không overwrite toàn bộ)
  if (updateProfileDto.socialLinks) {
    const existingProfile =
      await this.profileRepository.findByUserId(userId);

    updateData.socialLinks = {
      ...(existingProfile?.socialLinks || {}),
      ...updateProfileDto.socialLinks,
    };
  }

  // ❗ userId chỉ lấy từ token, không bao giờ từ DTO
  return this.profileRepository.upsertByUserId(userId, updateData);
}


}
