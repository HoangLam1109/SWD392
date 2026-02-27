import { ApiProperty } from '@nestjs/swagger';

export class GameResponseDto {
  @ApiProperty({
    description: 'Game unique identifier',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Game title',
    example: 'The Legend of Zelda',
  })
  title: string;

  @ApiProperty({
    description: 'Game price',
    example: 59.99,
  })
  price: number;

  @ApiProperty({
    description: 'Game status active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Game description',
    example: 'An epic adventure game',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Game discount percentage',
    example: 10,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'Game thumbnail URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  thumbnail?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  coverImage?: string;

  @ApiProperty({
    description: 'Game developer',
    example: 'Nintendo',
    required: false,
  })
  developer?: string;

  @ApiProperty({
    description: 'Game publisher',
    example: 'Nintendo',
    required: false,
  })
  publisher?: string;

  @ApiProperty({
    description: 'Game release date',
    example: '2023-05-12T00:00:00.000Z',
    required: false,
  })
  releaseDate?: string;

  @ApiProperty({
    description: 'Game URL',
    example: 'https://example.com/game',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: 'Game creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
