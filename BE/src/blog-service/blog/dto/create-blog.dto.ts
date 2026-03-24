import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
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
    description: 'Blog thumbnail URL (set from uploaded image)',
    example: 'https://res.cloudinary.com/demo/image/upload/v123456/blog.jpg',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Blog status',
    example: BlogStatus.PENDING_APPROVAL,
    enum: BlogStatus,
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
