import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Wallet ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  walletId: string;

  @ApiProperty({
    description: 'Reference ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  refId: string;

  @ApiProperty({
    description: 'Balance before transaction',
    example: 100.5,
  })
  @IsNumber()
  balanceBefore: number;

  @ApiProperty({
    description: 'Balance after transaction',
    example: 100.5,
  })
  @IsNumber()
  balanceAfter: number;

  @ApiProperty({
    description: 'Amount',
    example: 100.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.PAYMENT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Transaction description',
    example: 'Game purchase payment',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Transaction status',
    enum: TransactionStatus,
    example: TransactionStatus.PENDING,
    default: TransactionStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus = TransactionStatus.PENDING;
}
