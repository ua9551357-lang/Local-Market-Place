import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendResetCode(email: string, code: string) {
    await this.transporter.sendMail({
      from: `"LocalMarket" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Password Reset Code',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#166534;">LocalMarket</h2>
          <p>Aapne apna password reset karne ke liye request ki hai. Ye code use karo:</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; background:#f0fdf4; padding: 16px; text-align:center; border-radius: 8px; color:#166534;">
            ${code}
          </div>
          <p style="color:#666; font-size: 13px; margin-top: 16px;">Ye code 10 minute me expire ho jayega. Agar aapne ye request nahi ki to is email ko ignore kar dein.</p>
        </div>
      `,
    });
  }
}