import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsObject,
  IsOptional,
  IsMongoId,
  IsNumber,
} from 'class-validator';
import { GameItemType } from '../enum/type.enum';

export class CreateGameItemDto {
  @ApiProperty({
    description: 'Game ID this item belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({
    description: 'Name of the game item',
    example: 'Health Potion',
  })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({
    description: 'Type of the game item',
    example: 'POTION',
    enum: GameItemType,
  })
  @IsEnum(GameItemType)
  itemType: GameItemType;

  @ApiProperty({
    description: 'Price of the game item',
    example: 100,
  })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({
    description: 'Discount of the game item',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({
    description: 'Description of the game item',
    example: 'Restores 50 HP when consumed',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL to the item image/icon',
    example: 'https://example.com/item.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'Whether the item is available for use',
    example: true,
    default: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Effect data for the item',
    example: { healAmount: 50, duration: 0 },
  })
  @IsObject()
  effectData: Record<string, any>;
}
