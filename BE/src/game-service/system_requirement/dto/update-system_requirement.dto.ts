import { PartialType } from '@nestjs/swagger';
import { CreateSystemRequirementDto } from './create-system_requirement.dto';
import { IsString, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { RequirementType } from '../enum/requirement.enum';

export class UpdateSystemRequirementDto extends PartialType(
  CreateSystemRequirementDto,
) {
  @IsMongoId()
  @IsOptional()
  gameId?: string;

  @IsEnum(RequirementType)
  @IsOptional()
  requirementType?: RequirementType;

  @IsString()
  @IsOptional()
  os?: string;

  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  memory?: string;

  @IsString()
  @IsOptional()
  graphics?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
