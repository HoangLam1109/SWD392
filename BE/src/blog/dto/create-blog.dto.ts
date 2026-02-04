import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsUrl, IsOptional } from 'class-validator';
import { BlogStatus } from '../enum/blog.enum';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'My First Blog Post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Blog content',
    example: 'This is the content of my blog post...',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Blog thumbnail URL',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Blog status',
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
}
