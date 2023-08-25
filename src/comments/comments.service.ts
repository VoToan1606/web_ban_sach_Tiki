import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./shemas/comment.shema";
import { SoftDeleteModel } from "soft-delete-plugin-mongoose";
import { IUser } from "src/interface/user.interface";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: SoftDeleteModel<CommentDocument>
  ) {}
  async create(createCommentDto: CreateCommentDto, user: IUser) {
    const newComment = await this.commentModel.create({
      ...createCommentDto,
      userId: user.id,
    });
    const newCommentResult = await newComment.populate({
      path: "userId",
      select: { name: 1, email: 1 },
    });

    return newCommentResult;
  }

  async findAllByProduct(productId: string) {
    return await this.commentModel.find({ productId }).populate({
      path: "userId",
      select: { name: 1, email: 1 },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async remove(id: string, user: IUser) {
    await this.commentModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user.id, email: user.email } }
    );
    return await this.commentModel.softDelete({ _id: id });
  }
}
