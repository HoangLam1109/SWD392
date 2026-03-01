import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Transaction code',
    example: 'TXN-2024-001',
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
