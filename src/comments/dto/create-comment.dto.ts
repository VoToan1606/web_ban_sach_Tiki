import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  review: string;
}
