import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
      private authService: AuthService,
    ) {
      super({ usernameField: 'username' });
    }

    async validate(username: string, password: string): Promise<any> {
      console.log(username, password);
      const user = await this.authService.validateUser(username, password);
      if(!user) {
        throw new UnauthorizedException({
            is_success: false,
            message: 'User not found',
        });
      }
      return user;
    } 
}