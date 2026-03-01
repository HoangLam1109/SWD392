import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Transaction code',
    example: 'TXN-2024-001',
  })
  @IsOptional()
  @IsString()
  transactionCode?: string;

  @ApiPropertyOptional({
    description: 'Payment method',
    example: 'credit_card',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
