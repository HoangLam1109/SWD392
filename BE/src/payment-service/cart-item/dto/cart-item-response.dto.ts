import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'Cart Item ID',
    example: '698175d5c4308f3653af15d6',
  })
  _id: string;

  @ApiProperty({
    description: 'Cart ID',
    example: '698175d5c4308f3653af15d4',
  })
  cartId: string;

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
    description: 'Discount at purchase',
    example: 15,
  })
  discount: number;

  @ApiProperty({
    description: 'Cart item creation date',
    example: '2024-02-28T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Cart item last update date',
    example: '2024-02-28T10:30:00Z',
  })
  updated_at: Date;
}
