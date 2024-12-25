import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';
import { AllowedAction } from 'src/auth/decorator/action.decorator';
import { CreateRoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @AllowedAction(
    MODULE_NAME.GUEST,
    // ALLOWEDACTION.CREATE,
    // ALLOWEDACTION.READ,
    // ALLOWEDACTION.UPDATE,
    // ALLOWEDACTION.delete,
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

  @Get()
  @AllowedAction(MODULE_NAME.ROLES, ALLOWEDACTION.READ)
  async listAllRoles(@Req() req) {
    const roles = await this.roleService.listAllRoles(req.user);
    return {
      is_success: true,
      message: 'Successfully fetched roles',
      data: roles,
    };
  }

  @Put('/:roleId')
  @AllowedAction(
    MODULE_NAME.ROLES,
    ALLOWEDACTION.CREATE,
    ALLOWEDACTION.READ,
    ALLOWEDACTION.UPDATE,
    ALLOWEDACTION.delete,
  )
  async update(@Param('roleId') roleId: number, @Body() body: CreateRoleDto) {
    const { features, ...roleParams } = body;
    const role = await this.roleService.update(roleId, roleParams, features);
    return {
      is_success: true,
      message: 'Successfully updated',
      data: role,
    };
  }

  @Delete('/:roleId')
  @AllowedAction(
    MODULE_NAME.ROLES,
    ALLOWEDACTION.CREATE,
    ALLOWEDACTION.READ,
    ALLOWEDACTION.UPDATE,
    ALLOWEDACTION.delete,
  )
  async delete(@Param('roleId') roleId: number) {
    await this.roleService.delete(roleId);
    return {
      is_success: true,
      message: 'Successfully deleted role',
    };
  }
}
