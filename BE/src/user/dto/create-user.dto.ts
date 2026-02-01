import { UserRole, UserStatus } from '../enum/user.enum';
import {
  IsEmail,
  IsEnum,
  IsStrongPassword,
  IsUrl,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserServiceDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPass123!',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PLAYER,
  })
  @IsEnum(UserRole)
  role: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: string;
}
