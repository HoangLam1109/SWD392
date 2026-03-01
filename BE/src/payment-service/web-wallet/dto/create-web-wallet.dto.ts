import { IsString, IsNumber, IsEnum, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebWalletDto {
  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Balance',
    example: 100.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Status',
    example: 'ACTIVED',
    enum: ['ACTIVED', 'INACTIVED'],
  })
  @IsEnum(['ACTIVED', 'INACTIVED'])
  status: string;
}
