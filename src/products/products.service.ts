import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import aqp from "api-query-params";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "./shemas/product.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/interface/user.interface";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>
  ) {}
  async create(createProductDto: CreateProductDto, user: IUser) {
    const newProduct = await this.productModel.create({
      ...createProductDto,
      createdBy: { _id: user.id, email: user.email },
    });
    return {
      _id: newProduct._id,
      createdBy: newProduct.createdBy,
    };
  }

  async findAll(currentPage: number, pageSize: number, queryParams: string) {
    const { filter, sort, projection, population } = aqp(queryParams, {
      blacklist: ["current", "pageSize"],
    });
    const limit = pageSize ? pageSize : 10;
    const skip = (currentPage - 1) * limit;
    const total = (await this.productModel.find(filter)).length;
    const pages = Math.ceil(total / limit);
    const productResult = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    return {
      metaData: {
        pageSize: limit,
        currentPage,
        pages,
        total,
      },
      result: productResult,
    };
  }

  async findOne(id: string) {
    return await this.productModel.findById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: IUser) {
    return await this.productModel.updateOne(
      { _id: id },
      {
        ...updateProductDto,
        updatedBy: {
          _id: user.id,
          email: user.email,
        },
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.productModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return await this.productModel.softDelete({ _id: id });
  }
}
