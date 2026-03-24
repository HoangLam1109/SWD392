import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LibraryGameStatus } from '../enum/library-game-status.enum';

export class LibraryGameLeaderboardResponseDto {
  @ApiProperty({ description: 'Rank in leaderboard', example: 1 })
  rank: number;

  @ApiProperty({
    description: 'User Mongo id',
    example: '67d0f5ca8fa4f25a819f2a95',
  })
  user_id: string;

  @ApiProperty({
    description: 'Game Mongo id of top score record',
    example: '67d0f5ca8fa4f25a819f2a96',
  })
  game_id: string;

  @ApiProperty({ description: 'Highest score of this user', example: 1500 })
  highest_score: number;

  @ApiProperty({ description: 'Total playtime from top record', example: 120 })
  total_playtime: number;

  @ApiPropertyOptional({
    description: 'Last played time from top record',
    example: '2026-03-12T10:00:00.000Z',
  })
  last_played_at?: Date;

  @ApiProperty({
    description: 'Status from top score record',
    enum: LibraryGameStatus,
    example: LibraryGameStatus.PLAYING,
  })
  status: LibraryGameStatus;
}
