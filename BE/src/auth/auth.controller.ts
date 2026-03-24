import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseDto } from './dto/response.dto';
import { Public } from './decorators/public.decorator';
import { GetUser } from 'src/common/decorators/info.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PayloadDto } from './dto/payload.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logIn(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return result;
  }

  @ApiOperation({ summary: 'User register' })
  @ApiResponse({
    status: 200,
    description: 'Register successful',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Bad request',
        statusCode: 400,
      },
    },
  })
  @Post('register')
  @Public()
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(registerDto);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return result;
  }

  @Get('oauth')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('oauth/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @GetUser() user: any,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.generateTokens(user);
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    const userData = encodeURIComponent(JSON.stringify(user));
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(
      `${frontendUrl}/oauth/callback?accessToken=${tokens.accessToken}&user=${userData}`,
    );
  }

  @ApiOperation({ summary: 'User refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Refresh successful',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() req: { user: PayloadDto },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refresh(req.user);
    if (result) {
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }
    return result;
  }
}
