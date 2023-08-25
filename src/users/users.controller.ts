import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ResponseMessage } from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ResponseMessage("Create a user")
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ResponseMessage("Fetch user with paginate")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") pageSize: string,
    @Query() queryParams: string
  ) {
    return this.usersService.findAll(+currentPage, +pageSize, queryParams);
  }

  @ResponseMessage("Fetch a user")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage("Update a user")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    user: IUser
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @ResponseMessage("Delete a user")
  @Delete(":id")
  remove(@Param("id") id: string, user: IUser) {
    return this.usersService.remove(id, user);
  }
}
