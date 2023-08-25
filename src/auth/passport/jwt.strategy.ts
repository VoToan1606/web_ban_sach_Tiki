import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IUser } from "src/interface/user.interface";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private rolesService: RolesService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("SECRET_ACCESS_TOKEN"),
    });
  }

  async validate(user: IUser) {
    const roleById = await this.rolesService.findOne(user.role._id);
    const permissions = roleById.permissions;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions,
    };
  }
}
