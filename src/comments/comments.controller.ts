import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

import { Public, User } from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Public()
  @Get()
  findAllByProduct(@Body("productId") productId: string) {
    return this.commentsService.findAllByProduct(productId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.commentsService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @User() user: IUser) {
    return this.commentsService.remove(id, user);
  }
}
