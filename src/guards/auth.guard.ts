import { ROLES_KEY } from 'src/decorators/role.decorator';
import { EUserRole } from 'src/shared/common.constants';
import { UsersService } from 'src/users/users.service';

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const accessToken = req.cookies.token;
    // console.log('accessToken', accessToken);
    if (!accessToken || accessToken === 'none') {
      throw new BadRequestException('Authorization is required');
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (new Date(decoded.exp * 1000) < new Date()) {
      throw new UnauthorizedException('Token is expired');
    }

    const requiredRoles = this.getRouteRoles(context);
    if (!requiredRoles) {
      return true;
    }
    try {
      const currentUser = await this.userService.findOne(decoded.id);
      return Object.values(requiredRoles).includes(currentUser.data.role);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private getRouteRoles(context: ExecutionContext): string[] | void {
    let routeRoles = this.reflector.get<EUserRole[] | void>(
      ROLES_KEY,
      context.getClass(),
    );
    if (!routeRoles) {
      routeRoles = this.reflector.get<EUserRole[] | void>(
        ROLES_KEY,
        context.getHandler(),
      );
    }

    return routeRoles;
  }
}
