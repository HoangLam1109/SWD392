import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseDto } from './dto/response.dto';
import { Public } from './decorators/public.decorator';

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
  login(@Body() loginDto: LoginDto) {
    return this.authService.logIn(loginDto.email, loginDto.password);
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
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'User refresh token - Currently unavailable' })
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
  @Public()
  refresh(@Body() refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
