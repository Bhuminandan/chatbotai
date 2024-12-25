import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { username: string; sub: number }) {
    const user = await this.userService.findOneUser({
      where: {
        username: payload.username,
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        is_success: false,
        message: 'Access Denied',
      });
    }

    return {
      username: user.username,
      userId: user.id,
      role_id: user.role.id,
    };
  }
}
