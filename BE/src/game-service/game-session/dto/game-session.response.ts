import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GameSessionResponseDto {
	@ApiProperty({
		description: 'Mongo document id',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	_id: string;

	@ApiProperty({
		description: 'Library game Mongo id (FK)',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	library_game_id: string;

	@ApiProperty({ description: 'Session score', example: 1500 })
	session_score: number;

	@ApiProperty({ description: 'Session duration in seconds', example: 1800 })
	session_duration: number;

	@ApiPropertyOptional({
		description: 'Session start timestamp',
		example: '2026-03-12T10:00:00.000Z',
	})
	started_at?: Date;

	@ApiPropertyOptional({
		description: 'Session end timestamp',
		example: '2026-03-12T10:30:00.000Z',
	})
	ended_at?: Date;

	@ApiProperty({
		description: 'Record creation timestamp',
		example: '2026-03-12T10:00:00.000Z',
	})
	created_at: Date;

	@ApiProperty({
		description: 'Record update timestamp',
		example: '2026-03-12T10:30:00.000Z',
	})
	updated_at: Date;
}

