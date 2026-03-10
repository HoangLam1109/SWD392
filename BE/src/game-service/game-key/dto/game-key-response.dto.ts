import { ApiProperty } from '@nestjs/swagger';
import { KeyStatus } from '../enum/key-status.enum';

export class GameKeyResponseDto {
  @ApiProperty({
    description: 'Game key ID',
    example: '698175d5c4308f3653af15d4',
  })
  _id: string;

  @ApiProperty({
    description: 'Game ID this key belongs to',
    example: '698175d5c4308f3653af15d5',
  })
  gameId: string;

  @ApiProperty({
    description: 'Unique game key code',
    example: 'ABC123-DEF456-GHI789',
  })
  keyCode: string;

  @ApiProperty({
    description: 'Order detail ID this key is associated with',
    example: '698175d5c4308f3653af15d6',
  })
  orderDetailId: string;

  @ApiProperty({
    description: 'Status of the game key',
    enum: KeyStatus,
    example: KeyStatus.AVAILABLE,
  })
  status: string;

  @ApiProperty({
    description: 'When the key was assigned',
    example: '2024-02-28T10:30:00Z',
    required: false,
  })
  assignedAt?: Date;

  @ApiProperty({
    description: 'When the key was activated',
    example: '2024-02-28T10:30:00Z',
    required: false,
  })
  activatedAt?: Date;

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
