import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great blog post!',
  })
  content: string;

  @ApiProperty({
    description: 'Blog ID',
    example: '507f1f77bcf86cd799439011',
  })
  blogId: string;

  @ApiProperty({
    description: 'User ID who created the comment',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID',
    example: '507f1f77bcf86cd799439011',
  })
  parentCommentId?: string;

  @ApiProperty({
    description: 'Is comment deleted',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Comment last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
