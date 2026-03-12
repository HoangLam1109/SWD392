import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GameItemResponseDto {
  @ApiProperty({
    description: 'Game item unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Game ID this item belongs to',
    example: '507f1f77bcf86cd799439011',
  })
  gameId: string;

  @ApiProperty({
    description: 'Name of the game item',
    example: 'Health Potion',
  })
  itemName: string;

  @ApiProperty({
    description: 'Type of the game item',
    example: 'CONSUMABLE',
    enum: ['WEAPON', 'ARMOR', 'CONSUMABLE', 'ACCESSORY', 'MATERIAL'],
  })
  itemType: string;

  @ApiProperty({
    description: 'Price of the game item',
    example: 100,
  })
  price: number;

  @ApiPropertyOptional({
    description: 'Discount of the game item',
    example: 0,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'Description of the game item',
    example: 'Restores 50 HP when consumed',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL to the item image/icon',
    example: 'https://example.com/item.png',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: 'Whether the item is available for use',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Effect data for the item',
    example: { healAmount: 50, duration: 0 },
  })
  effectData: Record<string, any>;

  @ApiProperty({
    description: 'Item creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Item last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
