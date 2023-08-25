import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CartsService } from "./carts.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { User } from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("carts")
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@User() user: IUser) {
    return this.cartsService.create(user);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cartsService.remove(+id);
  }
}
