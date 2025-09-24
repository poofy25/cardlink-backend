import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

/**
 * JwtStrategy is used by Passport to validate JWT access tokens.
 *
 * The `validate` method is called automatically by Passport after a JWT is successfully decoded and its signature is verified.
 *
 * - It runs whenever a route is protected by the JWT authentication strategy (e.g., with @UseGuards(AuthGuard('jwt'))).
 * - The `payload` argument contains the decoded JWT payload. By convention, `sub` (subject) is the user ID, and `email` is the user's email.
 * - This method can be used to perform additional validation or fetch the user from the database.
 * - Here, it simply returns an object with the userId and email, which will be attached to the request as `req.user`.
 *
 * `sub` stands for "subject" and is a standard JWT claim representing the unique identifier for the user (usually their ID).
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request): string | null => {
          return (req.cookies?.access_token as string) || null;
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRET ?? 'dev',
    });
  }

  /**
   * Called by Passport after JWT is verified.
   * @param payload - The decoded JWT payload ({ sub: string, email: string })
   * @returns An object attached to req.user
   */
  validate(payload: { sub: string; email: string }) {
    // No additional validation here; just return user info from payload.
    return { userId: payload.sub, email: payload.email };
  }
}
