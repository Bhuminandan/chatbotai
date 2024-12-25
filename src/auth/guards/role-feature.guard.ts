import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { RoleService } from 'src/role/role.service';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';
import { PERMISSION } from '../decorator/action.decorator';

@Injectable()
export class RoleFeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private roleService: RoleService,
  ) {}

  async getCurrentUserActionList(_roleId: number, moduleName: MODULE_NAME) {
    const role = await this.roleService.findOne({
      relations: {
        features: {
          feature: true,
        },
      },
      where: {
        id: _roleId,
        features: {
          feature: {
            module_name: moduleName,
          },
        },
      },
    });

    if (!role) return [];

    const features = _.map(role.features, 'feature');
    const allowedActions = _.map(features, 'action');
    return allowedActions;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const roleId = request?.user?.role_id;

    const { module: moduleName, allowed_action: requiredActions } =
      this.reflector.getAllAndOverride<{
        module: MODULE_NAME;
        allowed_action?: ALLOWEDACTION[];
      }>(PERMISSION, [context.getHandler(), context.getClass()]);

    const isPublic = moduleName === MODULE_NAME.GUEST ? true : false;

    if (isPublic) {
      return true;
    }

    const allowedActions = await this.getCurrentUserActionList(
      roleId,
      moduleName,
    );

    if (allowedActions.length === 0) {
      throw new ForbiddenException({
        is_success: false,
        message: `You don't have the required permission`,
      });
    }

    const isAllowed = requiredActions.every(
      (action) =>
        allowedActions.includes(action) ||
        allowedActions.includes(ALLOWEDACTION.ALL),
    );

    if (!isAllowed) {
      throw new ForbiddenException({
        is_success: false,
        message: `You don't have the required permission`,
      });
    }

    return true;
  }
}
