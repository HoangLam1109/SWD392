import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsDateString,
	IsInt,
	IsMongoId,
	IsNumber,
	IsOptional,
	Min,
} from 'class-validator';

export class UpdateGameSessionDto {
	@ApiPropertyOptional({
		description: 'Library game Mongo id (FK)',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	@IsOptional()
	@IsMongoId()
	library_game_id?: string;

	@ApiPropertyOptional({ description: 'Session score', example: 1250 })
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
