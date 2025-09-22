import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export const MAILER_TOKEN = 'MAILER_TRANSPORT';

@Module({
  providers: [
    {
      provide: MAILER_TOKEN,
      useFactory: () => {
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST ?? 'localhost',
          port: Number(process.env.SMTP_PORT ?? 1025),
          secure: String(process.env.SMTP_SECURE ?? 'false') === 'true',
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASSWORD
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASSWORD,
                }
              : undefined,
        });
        return transport;
      },
    },
  ],
  exports: [MAILER_TOKEN],
})
export class MailerModule {}
