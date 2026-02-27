import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequirementType } from '../enum/requirement.enum';

export class SystemRequirementResponseDto {
  @ApiProperty({
    description: 'System requirement unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  id: string;

  @ApiProperty({
    description: 'Game ID',
    example: '507f1f77bcf86cd799439011',
  })
  gameId: string;

  @ApiProperty({
    description: 'Requirement type',
    enum: RequirementType,
    example: RequirementType.MINIMUM,
  })
  requirementType: RequirementType;

  @ApiProperty({
    description: 'Operating system',
    example: 'Windows 10 64-bit',
  })
  os: string;

  @ApiProperty({
    description: 'Processor',
    example: 'Intel Core i5-2400 or AMD FX-6300',
  })
  processor: string;

  @ApiProperty({
    description: 'Memory (RAM)',
    example: '8 GB RAM',
  })
  memory: string;

  @ApiProperty({
    description: 'Graphics card',
    example: 'NVIDIA GeForce GTX 660 or AMD Radeon HD 7850',
  })
  graphics: string;

  @ApiProperty({
    description: 'Storage space',
    example: '50 GB available space',
  })
  storage: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'SSD recommended for better performance',
  })
  additionalNotes?: string;
}
