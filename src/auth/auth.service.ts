import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AccountsService } from '../accounts/accounts.service';
import { RegisterDto } from './dto/register.dto';
import { Account } from 'src/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.accountsService.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await argon2.hash(payload.password);
    const account = await this.accountsService.createAccount({
      email: payload.email,
      passwordHash,
      displayName: payload.displayName,
    });
    const tokens = await this.generateTokens(
      String(account.id),
      String(account.email),
    );
    const user = {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
    };
    return { ...tokens, user };
  }

  async login(email: string, password: string) {
    const account = await this.accountsService.findByEmail(email);
    if (!account) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(String(account.passwordHash), password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(
      String(account.id),
      String(account.email),
    );
    const user = {
      id: account.id,
      email: account.email,
      displayName: account.displayName,
    };
    return { ...tokens, user };
  }

  async refresh(userId: string, email: string) {
    return this.generateTokens(userId, email);
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_ACCESS_SECRET ?? 'dev',
        expiresIn: process.env.JWT_ACCESS_EXPIRES ?? '15m',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email, type: 'refresh' },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev2',
        expiresIn: process.env.JWT_REFRESH_EXPIRES ?? '7d',
      },
    );
    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ sub: string; email: string }> {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      email: string;
      type?: string;
    }>(token, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'dev2',
    });
    if (payload?.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { sub: payload.sub, email: payload.email };
  }

  async getUserByAccessToken(token: string): Promise<Account | null> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: process.env.JWT_ACCESS_SECRET ?? 'dev',
      });
      return this.accountsService.findByEmail(payload.email);
    } catch {
      // JWT verification failed (expired, invalid, etc.)
      return null;
    }
  }
}
