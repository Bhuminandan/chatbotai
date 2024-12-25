import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AllowedRoles } from 'src/auth/decorator/action.decorator';
import { MODULE_TYPE, ROLENAMES } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @AllowedRoles(MODULE_TYPE.PRIVATE, ROLENAMES.ADMIN)
  async getAllUsers(@Req() req: any) {
    const users = await this.userService.findUsers({});
    return {
      is_success: true,
      message: 'All users',
      data: users,
    };
  }
}
