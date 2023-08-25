import { Injectable, BadRequestException } from "@nestjs/common";
import { CreateRegisterUserDto, CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./shemas/user.shema";
import { InjectModel } from "@nestjs/mongoose";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import aqp from "api-query-params";
import { genSaltSync, hashSync } from "bcrypt";
import { Role, RoleDocument } from "src/roles/shemas/role.shema";
import { IUser } from "src/interface/user.interface";
import { USER_ROLE } from "src/databases/sample";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
    });
    return newUser;
  }

  async createRegisterUser(createRegisterUserDto: CreateRegisterUserDto) {
    const { email } = createRegisterUserDto;
    const isFoundEmail = await this.userModel.findOne({ email });
    if (isFoundEmail) {
      throw new BadRequestException("email already exist");
    }
    const { password } = createRegisterUserDto;
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    //find role user
    const roleUser = await this.roleModel.findOne({ name: USER_ROLE });
    const newUser = await this.userModel.create({
      ...createRegisterUserDto,
      password: hashPassword,
      role: roleUser._id,
    });
    return {
      _id: newUser._id,
      role: roleUser.name,
    };
  }

  async findAll(currentPage: number, pageSize: number, queryParams: string) {
    const { filter, sort, projection, population } = aqp(queryParams, {
      blacklist: ["current", "pageSize"],
    });
    const limit = pageSize ? pageSize : 10;
    const skip = (currentPage - 1) * limit;
    const total = (await this.userModel.find(filter)).length;
    const pages = Math.ceil(total / limit);
    const userByPaginate = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population);
    return {
      metadata: {
        currentPage,
        total,
        pages,
        limit,
      },
      result: userByPaginate,
    };
  }

  findOne(id: string) {
    return this.userModel
      .findById(id)
      .select("-password")
      .populate({ path: "role", select: { name: 1 } });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user.id,
          email: user.email,
        },
      }
    );
  }

  gethashPassword(password: string) {
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    return hashPassword;
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return await this.userModel.softDelete({ _id: id });
  }

  async findByUserName(userName) {
    const userByUserName = Object(
      await this.userModel
        .findOne({ email: userName })
        .populate({ path: "role", select: { name: 1 } })
    );

    const roleById = await this.roleModel
      .findById(userByUserName.role._id)
      .populate({
        path: "permissions",
        select: { name: 1, method: 1, apiPath: 1, module: 1 },
      });
    const permissions = roleById.permissions;
    const { name, email, password, address, role } = userByUserName;
    return {
      id: userByUserName._id,
      name,
      email,
      password,
      address,
      role,
      permissions,
    };
    // return userByUserName;
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    return await this.userModel.updateOne({ _id: id }, { refresh_token });
  }
}
