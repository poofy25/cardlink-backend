import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: ['src/entities/*.entity{.ts,.js}'],
  migrations: ['db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  logging: false,
});
