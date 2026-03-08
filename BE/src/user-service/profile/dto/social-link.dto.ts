import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsString, ValidateIf } from 'class-validator';

export class SocialLinksDto {
  @ApiPropertyOptional({
    example: 'https://facebook.com/user',
  })
  @IsOptional()
  @ValidateIf((o) => o.facebook !== '')
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({
    example: 'https://discord.gg/abc123',
  })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiPropertyOptional({
    example: 'https://youtube.com/@user',
  })
  @IsOptional()
  @ValidateIf((o) => o.youtube !== '')
  @IsUrl()
  youtube?: string;
}
