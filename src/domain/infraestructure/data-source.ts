import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../../application/config/env/env';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  entities: [`${__dirname}/../core/models/*.{ts,js}`]
});
