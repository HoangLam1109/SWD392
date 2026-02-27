import { Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { ProfileRepository } from './repositories/profile.repository';

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
