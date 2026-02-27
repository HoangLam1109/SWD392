import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is an updated comment!',
  })
  @IsString()
  content: string;
}
