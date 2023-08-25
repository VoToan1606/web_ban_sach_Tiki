import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CartItem, CartItemDocument } from "./shemas/cart-item.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { CartsService } from "src/carts/carts.service";
import { IUser } from "src/interface/user.interface";
import mongoose from "mongoose";
import aqp from "api-query-params";

@Injectable()
export class CartItemsService {
  constructor(
    @InjectModel(CartItem.name)
    private cartItemModel: SoftDeleteModel<CartItemDocument>,
    private cartservice: CartsService
  ) {}

  async findCartByUser(user: IUser) {
    const carts = await this.cartservice.findAll();
    return carts.find((cart) => {
      return String(cart.userId) === user.id;
    });
  }
  async create(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("id is not valid, pass objectId please");
    }

    const cartByUser = await this.findCartByUser(user);
    const cartItems = await this.cartItemModel.find({});
    const CartItemFound = cartItems.find(
      (cartItem) =>
        String(cartItem.cartId) === String(cartByUser._id) &&
        String(cartItem.productId) === id
    );
    if (CartItemFound) {
      const CartItemUpdate = await this.cartItemModel.updateOne(
        { _id: CartItemFound._id },
        {
          quantity: CartItemFound.quantity + 1,
        }
      );
      return CartItemUpdate;
    } else {
      const newCartItem = await this.cartItemModel.create({
        productId: id,
        cartId: cartByUser._id,
        quantity: 1,
      });
      return newCartItem;
    }
  }

  async findAll(queryParams: string, user: IUser) {
    const { skip, limit, sort, projection, population } = aqp(queryParams);
    const cartByUser = await this.findCartByUser(user);
    return await this.cartItemModel
      .find({ cartId: cartByUser._id })
      .skip(skip)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  async update(id: string, quantity: number) {
    return await this.cartItemModel.updateOne({ _id: id }, { quantity });
  }

  async remove(id: string) {
    return await this.cartItemModel.deleteOne({ _id: id });
  }
}
