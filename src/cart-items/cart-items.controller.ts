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
import { CartItemsService } from "./cart-items.service";
import { User } from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("cart-items")
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  create(@Body("id") id: string, @User() user: IUser) {
    return this.cartItemsService.create(id, user);
  }

  @Get()
  findAll(@Query() queryParams: string, @User() user: IUser) {
    return this.cartItemsService.findAll(queryParams, user);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cartItemsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body("quantity") quantity: number) {
    return this.cartItemsService.update(id, quantity);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cartItemsService.remove(id);
  }
}
