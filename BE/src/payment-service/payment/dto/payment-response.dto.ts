import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: '507f1f77bcf86cd799439011',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Transaction code',
    example: 'TXN123456789',
  })
  transactionCode: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'VNPay',
  })
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Payment last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
