import { ApiProperty } from '@nestjs/swagger';

export class CartResponseDto {
  @ApiProperty({
    description: 'Cart ID',
    example: '698175d5c4308f3653af15d4',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  userId: string;

  @ApiProperty({
    description: 'Array of cart item IDs',
    example: ['item1', 'item2'],
  })
  itemId: string[];

  @ApiProperty({
    description: 'Cart creation date',
    example: '2024-02-28T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Cart last update date',
    example: '2024-02-28T10:30:00Z',
  })
  updated_at: Date;
}
