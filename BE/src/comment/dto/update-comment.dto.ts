import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString()
  @IsOptional()
  content?: string;
}
