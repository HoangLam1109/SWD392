import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserService } from '../user-service/user/services/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserRole, UserStatus } from '../user-service/user/enum/user.enum';
import { UserResponseDto } from '../user-service/user/dto/user-response.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('REFRESH_TOKEN_CONFIG') private refreshTokenConfig: any,
  ) { }

  async logIn(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<UserResponseDto>;
  }> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.passwordHash) {
      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordMatch) {
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync({
          ...payload,
          tokenType: 'access',
        });
        const refreshToken = await this.jwtService.signAsync(
          { ...payload, tokenType: 'refresh' },
          {
            secret: this.refreshTokenConfig.secret,
            expiresIn: this.refreshTokenConfig.expiresIn,
          },
        );
        return {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatar: user.avatar,
            role: user.role,
          },
        };
      } else throw new UnauthorizedException('Incorrect password');
    }
    throw new UnauthorizedException('User not found');
  }

  async register(registerDto: RegisterDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<UserResponseDto>;
  }> {
    const userData = {
      ...registerDto,
      role: UserRole.PLAYER,
      status: UserStatus.ACTIVE,
    };

    const user = await this.userService.createUser(userData);

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync({
      ...payload,
      tokenType: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, tokenType: 'refresh' },
      {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn,
      },
    );
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async refresh(
    payload: PayloadDto,
  ): Promise<
    { accessToken: string; user: Partial<UserResponseDto> } | undefined
  > {
    const user = await this.userService.findUserById(payload.userId);
    if (user) {
      const newPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      const accessToken = await this.jwtService.signAsync(newPayload);
      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
        },
      };
    }
    return undefined;
  }

  async validateGoogleUser(profile: any): Promise<any> {
    const { emails, name, photos } = profile;
    const email = emails[0].value;

    let user = await this.userService.findUserByEmail(email as string);

    if (!user) {
      const newUser = await this.userService.createUser({
        email,
        fullName: `${name.givenName} ${name.familyName}`,
        avatar: photos?.[0]?.value || null,
        password: '',
        role: 'Player',
        status: 'ACTIVE',
      });
      user = newUser;
    }

    return {
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  async generateTokens(
    user: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync({
      ...payload,
      tokenType: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, tokenType: 'refresh' },
      {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn,
      },
    );
    return { accessToken, refreshToken };
  }
}
