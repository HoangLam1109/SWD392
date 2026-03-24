import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateGameSessionDto {
  @ApiPropertyOptional({ description: 'Session score', example: 0, default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  session_score?: number;

  @ApiPropertyOptional({
    description: 'Session duration in seconds',
    example: 1800,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  session_duration?: number;

  @ApiPropertyOptional({
    description: 'Session start timestamp',
    example: '2026-03-12T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  started_at?: Date;

  @ApiPropertyOptional({
    description: 'Session end timestamp',
    example: '2026-03-12T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  ended_at?: Date;
}
