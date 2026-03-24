import { IsString, IsBoolean, IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserGameItemDto {
  @ApiProperty({
    description: 'User ID',
    example: '698175d5c4308f3653af15d4',
  })
  @IsMongoId()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Game item ID',
    example: '698175d5c4308f3653af15d5',
  })
  @IsMongoId()
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'Whether the item is equipped',
    example: false,
  })
  @IsBoolean()
  isEquipped: boolean;

  @ApiProperty({
    description: 'Quantity of the item',
    example: 1,
  })
  @IsNumber()
  quantity: number;
}
