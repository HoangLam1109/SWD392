import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsString, IsEnum, IsUrl, IsOptional } from 'class-validator';
import { BlogStatus } from '../enum/blog.enum';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;
}
