import { ApiProperty } from '@nestjs/swagger';

export class WebWalletResponseDto {
  @ApiProperty({
    description: 'Web wallet unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Current wallet balance',
    example: 1000.5,
  })
  balance: number;

  @ApiProperty({
    description: 'Wallet currency',
    example: 'USD',
  })
  currency: string;

  @ApiProperty({
    description: 'Wallet status',
    example: 'ACTIVED',
    enum: ['ACTIVED', 'INACTIVED'],
  })
  status: string;

  @ApiProperty({
    description: 'Wallet creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Wallet last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
