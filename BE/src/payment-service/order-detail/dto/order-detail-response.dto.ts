import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailResponseDto {
  @ApiProperty({
    description: 'Order Detail ID',
    example: '698175d5c4308f3653af15d4',
  })
  _id: string;

  @ApiProperty({
    description: 'Order ID',
    example: '698175d5c4308f3653af15d4',
  })
  orderId: string;

  @ApiProperty({
    description: 'Product ID',
    example: '698175d5c4308f3653af15d5',
  })
  productId: string;

  @ApiProperty({
    description: 'Price at purchase',
    example: 59.99,
  })
  priceAtPurchase: number;

  @ApiProperty({
    description: 'Discount',
    example: 10,
  })
  discount: number;

  @ApiProperty({
    description: 'Order type',
    example: 'Game',
    enum: ['Game', 'DLC'],
  })
  orderType: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Super Game Title',
  })
  productName: string;

  @ApiProperty({
    description: 'Order detail creation date',
    example: '2024-02-28T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Order detail last update date',
    example: '2024-02-28T10:30:00Z',
  })
  updated_at: Date;
}
