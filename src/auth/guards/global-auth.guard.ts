import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GlobalAuthGuard extends AuthGuard {
  constructor(
    jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
