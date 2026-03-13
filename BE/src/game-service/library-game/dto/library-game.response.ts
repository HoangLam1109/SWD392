import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LibraryGameStatus } from '../enum/library-game-status.enum';

export class LibraryGameResponseDto {
	@ApiProperty({
		description: 'Mongo document id',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	_id: string;

	@ApiProperty({
		description: 'User Mongo id (FK)',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	user_id: string;

	@ApiProperty({
		description: 'Game Mongo id (FK)',
		example: '67d0f5ca8fa4f25a819f2a96',
	})
	game_id: string;

	@ApiProperty({
		description: 'Game key Mongo id (FK)',
		example: '67d0f5ca8fa4f25a819f2a97',
	})
	key_id: string;

	@ApiProperty({ description: 'Highest score', example: 1500 })
	highest_score: number;

	@ApiProperty({ description: 'Total playtime in minutes', example: 120 })
	total_playtime: number;

	@ApiPropertyOptional({
		description: 'Last played timestamp',
		example: '2026-03-12T10:00:00.000Z',
	})
	last_played_at?: Date;

	@ApiPropertyOptional({
		description: 'Acquired timestamp',
		example: '2026-03-12T08:00:00.000Z',
	})
	acquired_at?: Date;

	@ApiProperty({
		description: 'Status of this library game',
		enum: LibraryGameStatus,
		example: LibraryGameStatus.OWNED,
	})
	status: LibraryGameStatus;

	@ApiProperty({
		description: 'Document creation timestamp',
		example: '2026-03-12T08:00:00.000Z',
	})
	created_at: Date;

	@ApiProperty({
		description: 'Document update timestamp',
		example: '2026-03-12T10:00:00.000Z',
	})
	updated_at: Date;
}

