import { basename, extname } from "path";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";

import { HttpException, HttpStatus } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from "@nestjs/platform-express";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      limits: {
        fileSize: 2000 * 2000,
      },
      // Check the mimetypes to allow for upload
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
      // Storage properties
      storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
          const module = req.headers.module;
          const uploadPath = `src/public/images/${module}`;
          if (!existsSync(uploadPath)) {
            // Do something
            mkdirSync(uploadPath);
          }
          cb(null, `src/public/images/${module}`);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
          // Calling the callback passing the random name generated with the original extension name
          const extName = extname(file.originalname);
          const baseName = basename(file.originalname, extName);

          const finalName = `${Date.now()}-${baseName}${extName}`;

          cb(null, finalName);
        },
      }),
    };
  }
}
