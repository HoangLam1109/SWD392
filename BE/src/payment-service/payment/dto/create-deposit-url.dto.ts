import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateDepositUrlDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Deposit amount',
    example: 100000,
  })
  @IsNumber()
  amount: number;
}
