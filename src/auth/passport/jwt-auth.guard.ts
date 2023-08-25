import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/decorator/customize.decorator";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException("pass access token, please");
    }
    // You can throw an exception based on either "info" or "err" arguments
    const req = context.switchToHttp().getRequest();
    const permissions = user.permissions || [];

    const isActive = permissions.find((permission) => {
      console.log("p:", permission.apiPath);
      console.log("r:", req.path);
      return permission.apiPath === req.path;
    });
    // console.log("check path", req.path);
    // console.log("check active", isActive);

    return user;
  }
}
