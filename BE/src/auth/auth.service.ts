import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/services/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UserRole, UserStatus } from '../user/enum/user.enum';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async logIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: Partial<UserResponseDto> }> {
    const user = await this.userService.findUserByEmail(email);
    if (user && user.passwordHash) {
      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordMatch) {
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
          accessToken,
          user: {
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

  async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; user: Partial<UserResponseDto> }> {
    const userData = {
      ...registerDto,
      role: UserRole.PLAYER,
      status: UserStatus.ACTIVE,
    };

    const user = await this.userService.createUser(userData);

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: {
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
