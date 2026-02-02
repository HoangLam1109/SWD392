import { IsUrl, IsString, IsNumber, IsBoolean, IsDate } from 'class-validator';
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
    description: 'Release date',
    example: '2024-01-01',
  })
  @IsDate()
  releaseDate?: Date;

  @ApiPropertyOptional({
    description: 'Game url',
    example: 'https://example.com/game',
  })
  @IsUrl()
  url?: string;
}
