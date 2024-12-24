import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AllowedAction } from 'src/auth/decorator/action.decorator';
import { ALLOWEDACTION, MODULE_NAME } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @AllowedAction(
    MODULE_NAME.USER, 
    ALLOWEDACTION.READ
  )
  async getAllUsers(@Req() req: any) {
    const users = await this.userService.findUsers({});
    return {
      is_success: true,
      message: 'All users',
      data: users,
    };
  }
}
