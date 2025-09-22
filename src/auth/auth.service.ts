import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const passwordHash = await argon2.hash(payload.password);
    const user = await this.usersService.createUser({
      email: payload.email,
      passwordHash,
      displayName: payload.displayName,
    });
    return this.generateTokens(String(user.id), String(user.email));
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await argon2.verify(String(user.passwordHash), password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.generateTokens(String(user.id), String(user.email));
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
}
