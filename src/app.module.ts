import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { CardLinksModule } from './cardlinks/cardlinks.module';
import { LinksModule } from './links/links.module';
import { MediaModule } from './media/media.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from './common/mailer.module';
import databaseConfig from './configs/db.config';
import corsConfig from './configs/cors.config';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [corsConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return databaseConfig(configService);
      },
    }),
    AuthModule,
    AccountsModule,
    CardLinksModule,
    LinksModule,
    MediaModule,
    CommonModule,
    MailerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
