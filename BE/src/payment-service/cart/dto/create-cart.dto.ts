import { IsArray, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiPropertyOptional({
    description: 'Array of cart item IDs',
    example: ['item1', 'item2'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  itemId?: string[];
}
