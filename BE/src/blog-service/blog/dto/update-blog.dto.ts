import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiPropertyOptional({
    description: 'Remove current thumbnail',
    example: false,
    default: false,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return value;
  })
  @IsOptional()
  @IsBoolean()
  removeThumbnail: boolean = false;
}