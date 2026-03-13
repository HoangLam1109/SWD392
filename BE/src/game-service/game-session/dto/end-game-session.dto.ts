import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class EndGameSessionDto {
  @ApiProperty({ description: 'Final session score', example: 1500 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  session_score: number;
}
