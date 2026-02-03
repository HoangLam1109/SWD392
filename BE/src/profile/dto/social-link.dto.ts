import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsString } from 'class-validator';

export class SocialLinksDto {
  @ApiPropertyOptional({
    example: 'https://facebook.com/user',
  })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({
    example: 'https://discord.gg/abc123',
  })
  @IsOptional()
  @IsString() // discord invite/link không phải lúc nào cũng là URL chuẩn
  discord?: string;

  @ApiPropertyOptional({
    example: 'https://youtube.com/@user',
  })
  @IsOptional()
  @IsUrl()
  youtube?: string;
}
