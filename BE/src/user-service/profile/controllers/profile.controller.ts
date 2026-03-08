import { Controller, Get, Body, Put, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { GetUser } from '../../../common/decorators/info.decorator';
import { AuthGuard } from '../../../auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('profiles')
@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @ApiOperation({ summary: 'Get profile by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Profile found',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.profileService.getProfileByUserId(userId);
  }

  @ApiOperation({ summary: "Get own user's info" })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get('me')
  getMyInfo(@GetUser() user: Partial<{ _id: string }>) {
    return this.profileService.getProfileByUserId(user._id!);
  }

  @ApiOperation({ summary: 'Update my profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Put('me')
  updateMyProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.updateProfile(
      req.user.userId as string,
      updateProfileDto,
    );
  }
}
