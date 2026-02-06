import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlogStatus } from '../enum/blog.enum';

export class UpdateBlogStatusDto {
  @ApiProperty({
    enum: BlogStatus,
    enumName: 'BlogStatus',
    description: 'Blog status',
    example: BlogStatus.PUBLISHED,
  })
  @IsEnum(BlogStatus)
  status: BlogStatus;
}