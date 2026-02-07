import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great blog post!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Blog ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  blogId: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID for replies',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  parentCommentId?: string;
}
