import { Controller, Post } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadedFile, UseInterceptors } from "@nestjs/common/decorators";
import { basename, extname } from "path";
// import { multerOptions } from "./multer.config";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
