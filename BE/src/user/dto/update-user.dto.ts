import { PartialType } from '@nestjs/mapped-types';
import { CreateUserServiceDto } from './create-user.dto';
import { UserRole, UserStatus } from '../enum/user.enum';
import {
  IsEmail,
  IsEnum,
  IsStrongPassword,
  IsUrl,
  IsString,
} from 'class-validator';

export class UpdateUserServiceDto extends PartialType(CreateUserServiceDto) {
  @IsEmail()
  email?: string;

  @IsString()
  fullName?: string;

  @IsStrongPassword()
  password?: string;

  @IsEnum(UserRole)
  role?: string;

  @IsUrl()
  avatar?: string;

  @IsEnum(UserStatus)
  status?: string;
}
