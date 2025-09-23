import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
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
import { parseJwtExpirationToMs } from '../utils';
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

    const refreshTokenMaxAge = parseJwtExpirationToMs(
      process.env.JWT_REFRESH_EXPIRES ?? '7d',
    );
    const accessTokenMaxAge = parseJwtExpirationToMs(
      process.env.JWT_ACCESS_EXPIRES ?? '15m',
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: refreshTokenMaxAge,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: accessTokenMaxAge,
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
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    const refreshTokenMaxAge = parseJwtExpirationToMs(
      process.env.JWT_REFRESH_EXPIRES ?? '7d',
    );
    const accessTokenMaxAge = parseJwtExpirationToMs(
      process.env.JWT_ACCESS_EXPIRES ?? '15m',
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: refreshTokenMaxAge,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: accessTokenMaxAge,
    });
    return { accessToken, user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiOkResponse({ description: 'New access token' })
  @ApiUnauthorizedResponse({ description: 'No refresh token or invalid token' })
  async refresh(@Req() req: Request) {
    const cookiesMap: Record<string, string> | undefined = (
      req as unknown as {
        cookies?: Record<string, string>;
      }
    ).cookies;
    const token = cookiesMap?.['refresh_token'];
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const decoded = await this.authService.verifyRefreshToken(token);
      const tokens = await this.authService.refresh(
        String(decoded.sub),
        String(decoded.email),
      );
      return { accessToken: tokens.accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
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

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  @ApiOkResponse({ description: 'Successfully logged out' })
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear access token cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Successfully logged out' };
  }
}
