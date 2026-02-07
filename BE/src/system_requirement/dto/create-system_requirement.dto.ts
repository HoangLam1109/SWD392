import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsMongoId, IsEnum, IsOptional } from 'class-validator';
import { RequirementType } from '../enum/requirement.enum';

export class CreateSystemRequirementDto {
  @ApiProperty({
    description: 'Game ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  gameId: string;

  @ApiProperty({
    description: 'Requirement type',
    enum: RequirementType,
    example: RequirementType.MINIMUM,
  })
  @IsEnum(RequirementType)
  requirementType: RequirementType;

  @ApiProperty({
    description: 'Operating system',
    example: 'Windows 10 64-bit',
  })
  @IsString()
  os: string;

  @ApiProperty({
    description: 'Processor',
    example: 'Intel Core i5-2400 or AMD FX-6300',
  })
  @IsString()
  processor: string;

  @ApiProperty({
    description: 'Memory (RAM)',
    example: '8 GB RAM',
  })
  @IsString()
  memory: string;

  @ApiProperty({
    description: 'Graphics card',
    example: 'NVIDIA GeForce GTX 660 or AMD Radeon HD 7850',
  })
  @IsString()
  graphics: string;

  @ApiProperty({
    description: 'Storage space',
    example: '50 GB available space',
  })
  @IsString()
  storage: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'SSD recommended for better performance',
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
