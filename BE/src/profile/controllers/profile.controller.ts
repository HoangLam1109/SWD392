import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.getProfileById(id);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  updateMyProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(
      req.user.userId,
      updateProfileDto,
    );
  }
}
