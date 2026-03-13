import { Injectable, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    const port = process.env.PORT ?? 3000;
    const baseUrl = process.env.BACKEND_URL ?? `http://localhost:${port}`;
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${baseUrl}/auth/oauth/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authorizationParams() {
    return {
      prompt: 'select_account',
    };
  }

  async validate(
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.authService.validateGoogleUser(profile);
    done(null, user);
  }
}
