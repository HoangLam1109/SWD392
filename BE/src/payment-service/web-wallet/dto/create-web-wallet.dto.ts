import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum WalletStatus {
  ACTIVED = 'ACTIVED',
  INACTIVED = 'INACTIVED',
}

export class CreateWebWalletDto {
  @IsString()
  userId: string;

  @IsString()
  walletAddress: string;

  @IsNumber()
  balance: number;

  @IsString()
  @IsOptional()
  currency?: string = 'USD';

  @IsEnum(WalletStatus)
  @IsOptional()
  status?: WalletStatus = WalletStatus.ACTIVED;
}
