import { IsString, IsNumber, IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDetailDto {
  @ApiProperty({
    description: 'Order ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Product ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Price at purchase',
    example: 59.99,
  })
  @IsNumber()
  priceAtPurchase: number;

  @ApiProperty({
    description: 'Discount',
    example: 10,
  })
  @IsNumber()
  discount: number;

  @ApiProperty({
    description: 'Order type',
    example: 'Game',
    enum: ['Game', 'DLC'],
  })
  @IsEnum(['Game', 'DLC'])
  @IsString()
  orderType: string;
}
