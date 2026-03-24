import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { KeyStatus } from '../enum/key-status.enum';

export class CreateGameKeyDto {
  @ApiProperty({
    description: 'Game ID this key belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsString()
  gameId: string;

  @ApiProperty({
    description: 'Unique game key code',
    example: 'ABC123-DEF456-GHI789',
  })
  @IsNotEmpty()
  @IsString()
  keyCode: string;

  @ApiProperty({
    description: 'Status of the game key',
    enum: KeyStatus,
    example: KeyStatus.AVAILABLE,
    required: false,
    default: KeyStatus.AVAILABLE,
  })
  @IsEnum(KeyStatus)
  status: string;

  @ApiProperty({
    description: 'Library game ID this key is associated with',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsOptional()
  @IsString()
  libraryGameId?: string;

  @ApiProperty({
    description: 'When the key was assigned',
    example: '2024-02-28T10:30:00Z',
    required: false,
  })
  @IsOptional()
  assignedAt?: Date;

  @ApiProperty({
    description: 'When the key was activated',
    example: '2024-02-28T10:30:00Z',
    required: false,
  })
  @IsOptional()
  activatedAt?: Date;
}
