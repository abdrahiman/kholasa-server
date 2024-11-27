import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorator/roles.decorator';
import { IUserRequest } from 'src/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const request: IUserRequest = context.switchToHttp().getRequest();
    const user: any = request.user;
    const isAuth = roles.includes(user.role);

    if (!isAuth)
      throw new ForbiddenException(
        `This service requires one of these roles ${roles}`,
      );
    return isAuth;
  }
}
