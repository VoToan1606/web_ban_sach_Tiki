import { Controller, Post } from "@nestjs/common";
import { MailService } from "./mail.service";
import { ResponseMessage, User } from "src/decorator/customize.decorator";
import { IUser } from "src/interface/user.interface";

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @ResponseMessage("send mail")
  @Post("sendMail")
  sendMail(@User() user: IUser) {
    return this.mailService.sendUserConfirmation(user);
  }
}
