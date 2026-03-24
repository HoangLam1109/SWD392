import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Wallet ID',
    example: '507f1f77bcf86cd799439011',
  })
  walletId: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'PAYMENT',
    enum: ['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PAYMENT'],
  })
  type: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: 100.5,
  })
  amount: number;

  @ApiProperty({
    description: 'Balance before transaction',
    example: 500.0,
  })
  balanceBefore: number;

  @ApiProperty({
    description: 'Balance after transaction',
    example: 399.5,
  })
  balanceAfter: number;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Payment for order 123',
  })
  description: string;

  @ApiProperty({
    description: 'Reference ID',
    example: '507f1f77bcf86cd799439011',
  })
  refId: string;

  @ApiProperty({
    description: 'Transaction status',
    example: 'COMPLETED',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  status: string;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
