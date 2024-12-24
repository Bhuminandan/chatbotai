import { 
    ExecutionContext, 
    Injectable, 
    InternalServerErrorException, 
    Logger, 
    UnauthorizedException 
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { ALLOWEDACTION, MODULE_NAME } from "src/utils";
import { PERMISSION } from "../decorator/action.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
    
        const metadata = this.reflector.getAllAndOverride<{
            module: MODULE_NAME;
            allowed_action: ALLOWEDACTION[];
        }>(PERMISSION, [context.getHandler(), context.getClass()]);

        if (!metadata || !metadata.module) {
            Logger.error('No metadata found for jwt guard');
            throw new InternalServerErrorException(
                'Something went wrong, please try again later',
            );
        }

        const { module: moduleName, allowed_action: requiredActions } = metadata;

        const isPublic = moduleName === MODULE_NAME.GUEST;

        if (!request.headers.authorization && isPublic) {
            return true;
        }
    
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw (
                err ||
                new UnauthorizedException({
                    is_success: false,
                    message: 'Access token expired',
                })
            );
        }
        return user;
    }
}
