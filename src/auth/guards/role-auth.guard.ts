import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MODULE_TYPE, ROLENAMES } from 'src/utils';
import { PERMISSION } from '../decorator/action.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const metadata = this.reflector.getAllAndOverride<{
      module_type: MODULE_TYPE;
      roles: ROLENAMES[];
    }>(PERMISSION, [context.getHandler(), context.getClass()]);

    if (!metadata || !metadata.module_type) {
      Logger.error('No metadata found for jwt guard');
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }

    const { module_type, roles } = metadata;

    const isPublic = MODULE_TYPE.PUBLIC === module_type;

    if (!request.headers.authorization && isPublic) {
      return true;
    }

    if (isPublic) {
      return true;
    }

    if (roles.includes(request.user.role)) {
      return true;
    }

    return false;
  }
}
