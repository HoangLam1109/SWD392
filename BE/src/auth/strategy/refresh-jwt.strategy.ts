import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PayloadDto } from '../dto/payload.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private configService: ConfigService) {
    const secret = configService.get('refreshToken.secret');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          const cookieToken = (req.cookies as { refreshToken?: string })
            ?.refreshToken;
          return cookieToken;
        },
      ]),
      secretOrKey: secret,
      passReqToCallback: false,
    });
  }

  async validate(payload: PayloadDto) {
    if (payload.tokenType !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}
