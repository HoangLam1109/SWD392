import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiPropertyOptional({
    description: 'Game ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  gameId?: string;

  @ApiPropertyOptional({
    description: 'Price at purchase',
    example: 59.99,
  })
  @IsOptional()
  @IsNumber()
  priceAtPurchase?: number;
}
