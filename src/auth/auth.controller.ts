import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { createUserDto } from 'src/user/dto/user.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AllowedAction } from './decorator/action.decorator';
import { MODULE_NAME } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @AllowedAction(MODULE_NAME.GUEST)
  async login(@Request() req : any) {
    const tokens = await this.authService.signin(req.user);
    return {
      is_success: true,
      message: 'User logged in successfully',
      data: tokens
    }
  }

  @Post('/signup')
  @ApiBody({ type: createUserDto })
  async signup(@Body() createUserDto: createUserDto) {
    const user = await this.authService.signup(createUserDto);
    return {
      is_success: true,
      message: 'User created successfully',
      data: user.id
    }
  }
}
