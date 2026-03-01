import { IsEmail, IsOptional, IsString } from 'class-validator';

export class PayloadDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsOptional()
  tokenType?: string;
}
