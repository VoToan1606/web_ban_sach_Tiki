import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/interface/user.interface";
import { ConfigService } from "@nestjs/config";
import { Response, Request } from "express";
import ms from "ms";
import { CreateRegisterUserDto } from "src/users/dto/create-user.dto";
import { CartsService } from "src/carts/carts.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private cartservice: CartsService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserName(username);
    if (user && compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const refresh_token = await this.createRefreshToken(payload);
    const access_token = this.jwtService.sign(payload);
    //create a cart
    await this.cartservice.create(user);
    //save refresh token database
    await this.usersService.updateRefreshToken(
      String(payload.id),
      refresh_token
    );
    //save refresh token in cookie
    response.cookie("refresh_token", refresh_token, {
      maxAge: ms(this.configService.get<string>("EXPIRES_IN_REFRESH_TOKEN")),
      httpOnly: true,
    });
    return {
      access_token,
      payload: {
        ...payload,
        permissions: user.permissions,
      },
    };
  }

  async createRefreshToken(payload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>("SECRET_REFRESH_TOKEN "),
      expiresIn: this.configService.get<string>("EXPIRES_IN_REFRESH_TOKEN"),
    });
  }

  async handleRegister(createRegisterUserDto: CreateRegisterUserDto) {
    return await this.usersService.createRegisterUser(createRegisterUserDto);
  }

  async handleRefreshToken(request: Request, response: Response) {
    //get refresh token from cookie
    const refresh_token = request.cookies["refresh_token"];

    if (!refresh_token) {
      throw new UnauthorizedException("refresh token not valid");
    }

    const validToken = this.jwtService.verify(refresh_token);
    if (!validToken) {
      throw new UnauthorizedException("not unauthorized");
    }

    const payload = {
      email: validToken.email,
      id: validToken.id,
      role: validToken.role,
    };
    const newRefreshToken = await this.createRefreshToken(payload);
    const newAccesstoken = this.jwtService.sign(payload);
    //update refresh token database
    await this.usersService.updateRefreshToken(
      String(payload.id),
      newRefreshToken
    );
    //remove old cookie
    response.clearCookie("refresh_token");
    //set refresh token to cookie
    response.cookie("refresh_token", newRefreshToken, {
      maxAge: ms(this.configService.get<string>("EXPIRES_IN_REFRESH_TOKEN")),
      httpOnly: true,
    });
    return {
      access_token: newAccesstoken,
      payload,
    };
  }

  async handleLogOut(response: Response, user: IUser) {
    response.clearCookie("refresh_token");
    await this.usersService.updateRefreshToken(String(user.id), "");
    return "log out sucessful";
  }

  async getUser(user: IUser) {
    return user;
  }
}
