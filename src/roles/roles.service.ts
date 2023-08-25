import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Role, RoleDocument } from "./shemas/role.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/interface/user.interface";
import aqp from "api-query-params";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<RoleDocument>
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const newRole = await this.RoleModel.create({
      ...createRoleDto,
      createdBy: { _id: user.id, email: user.email },
    });
    return {
      _id: newRole._id,
      createdBy: newRole.createdBy,
    };
  }

  async findAll(currentPage: number, pageSize: number, queryParams: string) {
    const { filter, sort, projection, population } = aqp(queryParams, {
      blacklist: ["current", "pageSize"],
    });
    console.log("check filter", filter);
    const limit = pageSize ? pageSize : 10;
    const skip = (currentPage - 1) * limit;
    const total = (await this.RoleModel.find(filter)).length;
    const pages = Math.ceil(total / skip);
    const result = await this.RoleModel.find(filter)
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

  async findOne(id: string) {
    return (await this.RoleModel.findById(id)).populate({
      path: "permissions",
      select: { name: 1, method: 1, apiPath: 1, module: 1 },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return await this.RoleModel.updateOne(
      { _id: id },
      { ...updateRoleDto, updatedBy: { _id: user.id, email: user.email } }
    );
  }

  async remove(id: string, user: IUser) {
    await this.RoleModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return this.RoleModel.softDelete({ _id: id });
  }
}
