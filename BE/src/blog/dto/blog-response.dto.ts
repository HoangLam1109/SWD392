import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogStatus } from '../enum/blog.enum';

export class BlogResponseDto {
  @ApiProperty({
    description: 'Blog unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Blog title',
    example: 'My First Blog Post',
  })
  title: string;

  @ApiProperty({
    description: 'Blog content',
    example: 'This is the content of my blog post...',
  })
  content: string;

  @ApiPropertyOptional({
    description: 'Blog thumbnail URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Blog status',
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @ApiProperty({
    description: 'Blog view count',
    example: 0,
  })
  viewCount: number;

  @ApiPropertyOptional({
    description: 'Blog published date',
    example: '2024-01-01T00:00:00.000Z',
  })
  publishedAt?: string;

  @ApiProperty({
    description: 'User ID who created the blog',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Blog creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Blog last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
