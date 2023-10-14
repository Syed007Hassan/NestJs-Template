import { configDotenv } from 'dotenv';
import { User } from 'src/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Topic } from 'src/entities/topic.entity';
import { Comment } from 'src/entities/comment.entity';

configDotenv();

// export const PostgreSqlDataSource: TypeOrmModuleOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   schema: process.env.DB_SCHEMA,
//   entities: [User, Topic, Comment],
//   synchronize: true,
//   logging: true,
// };

export const PostgreSqlDataSource: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  schema: process.env.DB_SCHEMA,
  entities: [User, Topic, Comment],
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
};
