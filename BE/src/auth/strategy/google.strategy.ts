import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
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
    });
  }

  authorizationParams() {
    return {
      prompt: 'select_account',
    };
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
  ): Promise<any> {
    return this.authService.validateGoogleUser(profile);
  }
}
