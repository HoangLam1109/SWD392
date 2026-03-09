import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
  @ApiProperty({
    description: 'Amount',
    example: 100.5,
  })
  @IsNumber()
  amount: number;
}
