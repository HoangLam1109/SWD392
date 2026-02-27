import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'User ID',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Transaction ID',
    example: 'txn123',
  })
  @IsString()
  transactionId: string;

  @ApiPropertyOptional({
    description: 'Transaction code',
    example: 'txn123',
  })
  @IsString()
  transactionCode: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsString()
  paymentMethod: string;
}
