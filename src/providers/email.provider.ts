import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailProvider {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set to true if using SSL/TLS
      auth: {
        user: 'faisalkhan.webmobril@gmail.com',
        pass: 'wzosphgbgdjiclfz',
      },
    });
  }

  getMailerInstance() {
    return this.transporter;
  }

  async sentEmail(to: string, subject: string, text: string): Promise<boolean> {
    const mailOptions = {
      from: 'your-email@example.com',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }

  async sentForgotPasswordEmail(to: string, otp: string) {
    return await this.sentEmail(
      to,
      'Core Impact - Forgot Password',
      `Your Otp is ${otp}`,
    );
  }
}
