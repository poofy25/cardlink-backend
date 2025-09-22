import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return await Promise.resolve({
    type: 'postgres',
    host: configService.get('DATABASE_HOST') || 'localhost',
    port: configService.get('DATABASE_PORT') || 5432,
    username: configService.get('DATABASE_USERNAME') || 'root',
    password: configService.get('DATABASE_PASSWORD') || 'root',
    database: configService.get('DATABASE_NAME') || 'db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
  });
};
