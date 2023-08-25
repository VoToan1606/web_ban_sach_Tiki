import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "./shemas/category.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/interface/user.interface";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>
  ) {}
  async create(createCategoryDto: CreateCategoryDto, user: IUser) {
    const newCategory = await this.categoryModel.create({
      ...createCategoryDto,
      createdBy: { _id: user.id, email: user.email },
    });
    return {
      _id: newCategory._id,
      createdBy: newCategory.createdBy,
    };
  }

  async findAll() {
    return await this.categoryModel.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    return await this.categoryModel.updateOne(
      { _id: id },
      { ...updateCategoryDto, updatedby: { _id: user.id, email: user.email } }
    );
  }

  async remove(id: string, user: IUser) {
    await this.categoryModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return await this.categoryModel.softDelete({ _id: id });
  }
}
