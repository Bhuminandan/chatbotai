import { Body, Controller, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';
import { AllowedAction } from 'src/auth/decorator/action.decorator';
import { CreateRoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @AllowedAction(
    MODULE_NAME.ROLES,
    ALLOWEDACTION.CREATE,
    ALLOWEDACTION.READ,
    ALLOWEDACTION.UPDATE,
    ALLOWEDACTION.delete,
  )
  async createRole(@Body() body: CreateRoleDto) {
    try {
      const { features, ...roleParams } = body;
      await this.roleService.create(roleParams, features);
      return {
        is_success: true,
        message: 'Successfully created role',
      };
    } catch (error) {
      return {
        is_success: false,
        message: 'Unsuccessfull to create role',
        error,
      };
    }
  }
}
