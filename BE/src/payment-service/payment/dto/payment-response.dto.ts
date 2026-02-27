import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment unique identifier',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  userId: string;

  @ApiProperty({
    description: 'Payment transaction ID',
    example: '123456789',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Payment transaction code',
    example: '123456789',
  })
  transactionCode: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'Credit Card',
    required: false,
  })
  method?: string;

  @ApiProperty({
    description: 'Payment creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Payment last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
