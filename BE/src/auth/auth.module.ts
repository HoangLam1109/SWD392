import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user-service/user/user.module';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { ConfigModule } from '@nestjs/config';
import refreshTokenConfig from './config/refresh-token.config';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forFeature(refreshTokenConfig),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: 'REFRESH_TOKEN_CONFIG',
      useFactory: () => ({
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    },
    AuthService,
    GoogleStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
