import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'refreshToken',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    expiresIn: '7d',
  }),
);
