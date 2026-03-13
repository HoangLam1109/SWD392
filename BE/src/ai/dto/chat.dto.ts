import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddTextDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class QueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class ChatHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number = 10;
}
