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
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  Public,
  ResponseMessage,
  User,
} from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user: IUser) {
    return this.productsService.create(createProductDto, user);
  }
  @Public()
  @ResponseMessage("fetch product with paginate")
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") pageSize: string,
    @Query() queryParams: string
  ) {
    return this.productsService.findAll(+currentPage, +pageSize, queryParams);
  }

  @Public()
  @ResponseMessage("fetch product by id")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @ResponseMessage("update a product")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: IUser
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @ResponseMessage("delete a product")
  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.productsService.remove(id, user);
  }
}
