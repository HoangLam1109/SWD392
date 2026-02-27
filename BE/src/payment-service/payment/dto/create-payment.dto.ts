import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: 'txn123',
  })
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Transaction code',
    example: 'txn123',
  })
  @IsString()
  transactionCode: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsString()
  paymentMethod: string;
}
