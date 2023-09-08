import { configDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

configDotenv();

export const PostgreSqlDataSource: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  entities: [User],
  synchronize: true,
  logging: true,
};
