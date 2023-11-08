import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EmailProvider {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    if (!['true', 'false'].includes(configService.get('NODE_MAILER_SECURE'))) {
      throw new Error('env NODE_MAILER_SECURE must be true or false');
    }

    this.transporter = createTransport({
      host: configService.get('NODE_MAILER_HOST'),
      port: configService.get('NODE_MAILER_PORT'),
      secure: configService.get('NODE_MAILER_SECURE') === 'true' ? true : false, // Set to true if using SSL/TLS
      auth: {
        user: configService.get('NODE_MAILER_USER'),
        pass: configService.get('NODE_MAILER_PASS'),
      },
    });
  }

  getMailerInstance() {
    return this.transporter;
  }

  async sentEmail(to: string, subject: string, text: string): Promise<boolean> {
    const mailOptions = {
      from: this.configService.get('NODE_MAILER_USER'),
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
