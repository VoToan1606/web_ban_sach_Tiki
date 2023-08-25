import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { IUser } from "src/interface/user.interface";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: IUser) {
    // const url = `example.com/auth/confirm?token=${token}`;
    console.log(user);

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: "Your bill from tiki.com",
      template: "./confirmation", // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.name,
        url: "hj",
      },
    });
  }
}
