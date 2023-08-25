import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./passport/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./passport/jwt.strategy";
import { CartsModule } from "src/carts/carts.module";
import { RolesModule } from "src/roles/roles.module";

@Module({
  imports: [
    UsersModule,
    CartsModule,
    PassportModule,
    RolesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("SECRET_ACCESS_TOKEN"),
        signOptions: {
          expiresIn: configService.get<string>("EXPIRES_IN_ACESS_TOKEN"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
