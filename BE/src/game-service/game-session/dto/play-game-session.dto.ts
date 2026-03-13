import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class PlayGameSessionDto {
  @ApiProperty({
    description: 'Library game Mongo id (FK)',
    example: '67d0f5ca8fa4f25a819f2a95',
  })
  @IsMongoId()
  library_game_id: string;
}
