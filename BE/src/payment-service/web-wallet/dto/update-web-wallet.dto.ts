import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWebWalletDto {
  @ApiPropertyOptional({
    description: 'Balance',
    example: 100.5,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    description: 'Currency',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    description: 'Status',
    example: 'ACTIVED',
    enum: ['ACTIVED', 'INACTIVED'],
  })
  @IsOptional()
  @IsEnum(['ACTIVED', 'INACTIVED'])
  status?: string;
}
