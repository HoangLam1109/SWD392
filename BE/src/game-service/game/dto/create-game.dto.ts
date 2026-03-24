import {
  IsUrl,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGameDto {
  @ApiProperty({
    description: 'Game title',
    example: 'Title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Game price',
    example: '100000',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Game status active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Game category ID',
    example: 'category-id',
  })
  @IsMongoId()
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Game discount',
    example: '10',
  })
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({
    description: 'Game thumbnail',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsUrl()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Cover image',
    example: 'https://example.com/cover.jpg',
  })
  @IsUrl()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Developer',
    example: 'Developer',
  })
  @IsString()
  developer?: string;

  @ApiPropertyOptional({
    description: 'Publisher',
    example: 'Publisher',
  })
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({
    description:
      'Release date (ISO string, e.g. 2024-01-01 or 2024-01-01T00:00:00.000Z)',
    example: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  releaseDate?: Date;

  @ApiPropertyOptional({
    description: 'Game url',
    example: 'https://example.com/game',
  })
  @IsUrl({
    require_protocol: true,
    require_tld: false,
    protocols: ['http', 'https'],
  })
  url?: string;
}
