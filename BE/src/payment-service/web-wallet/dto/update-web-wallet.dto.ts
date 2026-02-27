import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateWebWalletDto, WalletStatus } from './create-web-wallet.dto';

export class UpdateWebWalletDto extends PartialType(CreateWebWalletDto) {
  @IsOptional()
  userId?: string;

  @IsOptional()
  walletAddress?: string;

  @IsOptional()
  balance?: number;

  @IsOptional()
  currency?: string;

  @IsEnum(WalletStatus)
  @IsOptional()
  status?: WalletStatus;
}
