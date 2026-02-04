import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Action',
  })
  categoryName: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Action games category',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Parent category ID',
    example: '507f1f77bcf86cd799439011',
  })
  parentCategoryId?: string;

  @ApiProperty({
    description: 'Game ID',
    example: '507f1f77bcf86cd799439011',
  })
  gameId: string;

  @ApiProperty({
    description: 'Category creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;
}
