import { Controller, Post, UseGuards, Res, Req, Body } from "@nestjs/common";
import { LocalAuthGuard } from "./passport/local-auth.guard";
import { AuthService } from "./auth.service";
import {
  Public,
  ResponseMessage,
  User,
} from "src/decorator/customize.decorator";
import { Response, Request } from "express";
import { CreateRegisterUserDto } from "src/users/dto/create-user.dto";
import { IUser } from "src/interface/user.interface";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @ResponseMessage("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage("register a user")
  @Public()
  @Post("register")
  async register(@Body() createRegisterUserDto: CreateRegisterUserDto) {
    return this.authService.handleRegister(createRegisterUserDto);
  }

  @ResponseMessage("get new token")
  @Public()
  @Post("refresh")
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.handleRefreshToken(request, response);
  }

  @ResponseMessage("logout a user")
  @Post("logout")
  async logOut(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser
  ) {
    return this.authService.handleLogOut(response, user);
  }

  @ResponseMessage("get user")
  @Post("reload")
  async getUser(@User() user: IUser) {
    return this.authService.getUser(user);
  }
}
