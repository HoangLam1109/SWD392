import { IsString, IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Cart ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  cartId: string;

  @ApiProperty({
    description: 'Game ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  gameId: string;

  @ApiProperty({
    description: 'Price at purchase',
    example: 59.99,
  })
  @IsNumber()
  priceAtPurchase: number;
}
