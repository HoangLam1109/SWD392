import {
  IsString,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../enum/status.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Wallet transaction ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  walletTransactionId: string;

  @ApiProperty({
    description: 'Order detail IDs',
    example: ['698175d5c4308f3653af15d6', '698175d5c4308f3653af15d7'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  orderDetailId?: string[];

  @ApiProperty({
    description: 'Total price',
    example: 59.99,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'PENDING',
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Completion date',
    example: '2024-02-28T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
