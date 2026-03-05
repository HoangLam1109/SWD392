import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../enum/status.enum';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: '698175d5c4308f3653af15d4',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  userId: string;

  @ApiProperty({
    description: 'Wallet transaction ID',
    example: '698175d5c4308f3653af15d5',
  })
  walletTransactionId: string;

  @ApiProperty({
    description: 'Order detail IDs',
    example: '698175d5c4308f3653af15d6',
  })
  orderDetailId: string[];

  @ApiProperty({
    description: 'Total price',
    example: 59.99,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'PENDING',
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-02-28T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Order last update date',
    example: '2024-02-28T10:30:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Completion date',
    example: '2024-02-28T10:30:00Z',
  })
  completedAt?: Date;
}
