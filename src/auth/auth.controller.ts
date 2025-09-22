import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import type { Response, Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user with email and password' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'JWT access and refresh tokens',
    type: AuthTokensDto,
  })
  @ApiBadRequestResponse({
    description: 'Email already in use or validation error',
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.register(dto);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/me',
      maxAge: 15 * 60 * 1000,
    });
    return { accessToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'JWT access and refresh tokens',
    type: AuthTokensDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto.email,
      dto.password,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/me',
      maxAge: 15 * 60 * 1000,
    });
    return { accessToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiOkResponse({ description: 'New access token' })
  async refresh(@Req() req: Request) {
    const cookiesMap: Record<string, string> | undefined = (
      req as unknown as {
        cookies?: Record<string, string>;
      }
    ).cookies;
    const token = cookiesMap?.['refresh_token'];
    if (!token) {
      return { accessToken: null };
    }
    const decoded = await this.authService.verifyRefreshToken(token);
    const tokens = await this.authService.refresh(
      String(decoded.sub),
      String(decoded.email),
    );
    return { accessToken: tokens.accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'Current user' })
  async me(@Req() req: Request) {
    const cookiesMap: Record<string, string> | undefined = (
      req as unknown as {
        cookies?: Record<string, string>;
      }
    ).cookies;
    const token = cookiesMap?.['access_token'];
    if (!token) {
      return { user: null };
    }
    const decoded = await this.authService.getUserByAccessToken(token);

    if (!decoded) {
      return { user: null };
    }

    return { user: decoded };
  }
}
