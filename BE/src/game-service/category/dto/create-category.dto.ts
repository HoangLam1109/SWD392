import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Action',
  })
  @IsString()
  categoryName: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Action games category',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsOptional()
  parentCategoryId?: string;

  @ApiProperty({
    description: 'Game ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  gameId: string;
}
