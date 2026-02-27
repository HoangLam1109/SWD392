import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  walletId?: string;

  @IsEnum(TransactionType)
  @IsOptional()
  transType?: TransactionType;

  @IsOptional()
  amount?: number;

  @IsOptional()
  balanceBefore?: number;

  @IsOptional()
  balanceAfter?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  refId?: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}
