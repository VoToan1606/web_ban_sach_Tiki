import { IsArray, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsArray()
  permissions: mongoose.Schema.Types.ObjectId[];
}
