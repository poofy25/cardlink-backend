import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { ProfilesModule } from './profiles/profiles.module';
import { LinksModule } from './links/links.module';
import { MediaModule } from './media/media.module';
import { CommonModule } from './common/common.module';
import { MailerModule } from './common/mailer.module';
import databaseConfig from './configs/db.config';
import corsConfig from './configs/cors.config';

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
    UsersModule,
    ProfilesModule,
    LinksModule,
    MediaModule,
    CommonModule,
    MailerModule,
  ],
})
export class AppModule {}
