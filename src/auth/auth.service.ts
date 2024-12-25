import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}

  async validateUser(_username: string, _password: string): Promise<any> {
    const user = await this.userService.findOneUser({
      where: { username: _username },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new BadRequestException({
        is_success: false,
        message: 'User not found',
      });
    }

    const isPasswordMatched = await bcrypt.compare(_password, user.password);

    if (user && isPasswordMatched) {
      return user;
    }
    return null;
  }

  async signin(user: Partial<User>) {
    const payload = {
      username: user.username,
      sub: user.id,
      role_id: user.role.id,
    };

    return await this.generateTokens(payload);
  }

  async generateTokens(payload: any) {
    const accessToken = await this.jwtService.sign(payload);
    // TODO: REFRESH TOKEN
    return { accessToken };
  }

  async signup(_user: Partial<User>, role_id: number) {
    const user = await this.userService.findOneUser({
      where: { username: _user.username },
    });

    if (user) {
      throw new BadRequestException({
        is_success: false,
        message: 'User already exist',
      });
    }

    const role = await this.roleService.findOne({
      where: { id: role_id },
    });

    if (!role) {
      throw new BadRequestException({
        is_success: false,
        message: 'Role does not exist',
      });
    }

    const hashedPassword = await this.passwordHashing(_user.password);
    _user.role = role;
    _user.password = hashedPassword;
    const newUser = await this.userService.createUser(_user);
    return newUser;
  }

  async passwordHashing(_password: string) {
    return await bcrypt.hash(_password, 12);
  }
}
