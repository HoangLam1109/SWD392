import { IsArray, IsOptional, IsMongoId } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiPropertyOptional({
    description: 'Array of cart item IDs',
    example: ['item1', 'item2'],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  itemId?: string[];
}
