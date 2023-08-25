import { Injectable } from "@nestjs/common";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { IUser } from "src/interface/user.interface";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "./shemas/cart.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private cartModel: SoftDeleteModel<CartDocument>
  ) {}
  async create(user: IUser) {
    const carts = await this.findAll();
    const isFoundCart = carts.find((cart) => {
      return String(cart.userId) === user.id;
    });
    if (isFoundCart) return;
    const newCart = this.cartModel.create({ userId: user.id });
    return newCart;
  }

  async findAll() {
    return await this.cartModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
