import { Module } from "@nestjs/common";
import { CartItemsService } from "./cart-items.service";
import { CartItemsController } from "./cart-items.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CartItem, CartItemSchema } from "./shemas/cart-item.shema";
import { CartsModule } from "src/carts/carts.module";

@Module({
  imports: [
    CartsModule,
    MongooseModule.forFeature([
      { name: CartItem.name, schema: CartItemSchema },
    ]),
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
