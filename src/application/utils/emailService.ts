import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env/env';
import { User } from '../../domain/core/models/user';

export class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
      }
    });
  }

  sendMail(to: Partial<User>, subject: string, html: string) {
    this.transporter.sendMail({
      from: `${env.EMAIL_NAME} <${env.EMAIL_FROM}>`,
      to: `${to.username}, <${to.email}>`,
      subject,
      html
    });
  }
}
