import { Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "./shemas/permission.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/interface/user.interface";
import aqp from "api-query-params";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private PermissionModel: SoftDeleteModel<PermissionDocument>
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const newPermission = await this.PermissionModel.create({
      ...createPermissionDto,
      createdBy: { _id: user.id, email: user.email },
    });
    return {
      _id: newPermission._id,
      createdBy: newPermission.createdBy,
    };
  }

  async findAll(currentPage: number, pageSize: number, queryParams: string) {
    const { filter, sort, projection, population } = aqp(queryParams, {
      blacklist: ["current", "pageSize"],
    });
    const limit = pageSize ? pageSize : 10;
    const skip = (currentPage - 1) * limit;
    const total = (await this.PermissionModel.find(filter)).length;
    const pages = Math.ceil(total / skip);
    const result = await this.PermissionModel.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    return {
      metadata: {
        currentPage,
        pageSize: limit,
        pages,
        total,
      },
      result,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser
  ) {
    return await this.PermissionModel.updateOne(
      { _id: id },
      { ...updatePermissionDto, updatedBy: { _id: user.id, email: user.email } }
    );
  }

  async remove(id: string, user: IUser) {
    await this.PermissionModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return this.PermissionModel.softDelete({ _id: id });
  }
}
