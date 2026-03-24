import {
  IsString,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../enum/status.enum';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Wallet transaction ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  @IsOptional()
  walletTransactionId?: string;

  @ApiPropertyOptional({
    description: 'Order detail IDs',
    example: ['698175d5c4308f3653af15d6', '698175d5c4308f3653af15d7'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  orderDetailId?: string[];

  @ApiPropertyOptional({
    description: 'Total price',
    example: 59.99,
  })
  @IsNumber()
  @IsOptional()
  totalPrice?: number;

  @ApiPropertyOptional({
    description: 'Payment status',
    example: 'PENDING',
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Completion date',
    example: '2024-02-28T10:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
