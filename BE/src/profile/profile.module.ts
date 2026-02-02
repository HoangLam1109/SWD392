import { Module } from '@nestjs/common';
import { ProfileService } from '../profile/services/profile.service';
import { ProfileController } from '../profile/controllers/profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../profile/entities/profile.entity';
import { ProfileRepository } from '../profile/repositories/profile.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Profile.name, schema: ProfileSchema }],
      'USER_DB',
    ),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
