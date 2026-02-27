import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { TransactionType, TransactionStatus } from '../enum/transaction.enum';

export class CreateTransactionDto {
  @IsString()
  walletId: string;

  @IsEnum(TransactionType)
  transType: TransactionType;

  @IsNumber()
  amount: number;

  @IsNumber()
  balanceBefore: number;

  @IsNumber()
  balanceAfter: number;

  @IsString()
  description: string;

  @IsString()
  refId: string;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus = TransactionStatus.PENDING;
}
