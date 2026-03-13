import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  IsUrl,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @ApiPropertyOptional({
    description: 'Game title',
    example: 'Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Game price',
    example: '100000',
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Game status active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Game category ID',
    example: 'category-id',
  })
  @IsMongoId()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Game discount',
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({
    description: 'Game thumbnail',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @ApiPropertyOptional({
    description: 'Cover image',
    example: 'https://example.com/cover.jpg',
  })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Developer',
    example: 'Developer',
  })
  @IsString()
  @IsOptional()
  developer?: string;

  @ApiPropertyOptional({
    description: 'Publisher',
    example: 'Publisher',
  })
  @IsString()
  @IsOptional()
  publisher?: string;

  @ApiPropertyOptional({
    description: 'Release date (ISO string)',
    example: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @ApiPropertyOptional({
    description: 'Game url',
    example: 'https://example.com/game',
  })
  @IsUrl()
  @IsOptional()
  url?: string;
}
