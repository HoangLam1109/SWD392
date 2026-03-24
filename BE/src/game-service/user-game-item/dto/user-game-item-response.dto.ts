import { ApiProperty } from '@nestjs/swagger';
import { IUserGameItem } from '../entities/user-game-item.entity';

export class UserGameItemResponseDto implements IUserGameItem {
  @ApiProperty({
    description: 'User game item ID',
    example: '698175d5c4308f3653af15d4',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d5',
  })
  userId: string;

  @ApiProperty({
    description: 'Game item ID',
    example: '698175d5c4308f3653af15d6',
  })
  itemId: string;

  @ApiProperty({
    description: 'Whether the item is equipped',
    example: false,
  })
  isEquipped: boolean;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-02-28T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Update timestamp',
    example: '2024-02-28T10:30:00Z',
  })
  updated_at: Date;
}
