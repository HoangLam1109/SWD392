import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { LibraryGameStatus } from '../enum/library-game-status.enum';

export class CreateLibraryGameDto {
  @ApiProperty({
    description: 'User id (FK)',
    example: '67d0f5ca8fa4f25a819f2a95',
  })
  @IsMongoId()
  user_id: string;

  @ApiProperty({
    description: 'Game id (FK)',
    example: '67d0f5ca8fa4f25a819f2a96',
  })
  @IsMongoId()
  game_id: string;

  @ApiPropertyOptional({
    description: 'Key id (FK)',
    example: '67d0f5ca8fa4f25a819f2a97',
  })
  @IsOptional()
  @IsMongoId()
  key_id?: string;

  @ApiPropertyOptional({
    description: 'Highest score of this user in this game',
    example: 1500,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  highest_score?: number;

  @ApiPropertyOptional({
    description: 'Total playtime in minutes',
    example: 120,
    default: 0,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  total_playtime?: number;

  @ApiPropertyOptional({
    description: 'Last played timestamp',
    example: '2026-03-12T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  last_played_at?: Date;

  @ApiPropertyOptional({
    description: 'Acquired timestamp',
    example: '2026-03-12T08:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  acquired_at?: Date;

  @ApiPropertyOptional({
    description: 'Current status of this library game',
    enum: LibraryGameStatus,
    default: LibraryGameStatus.OWNED,
  })
  @IsOptional()
  @IsEnum(LibraryGameStatus)
  status?: LibraryGameStatus;
}
