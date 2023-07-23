import { Comment } from 'src/entities/comment.entity';
import { Topic } from 'src/entities/topic.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSword,
  schema: process.env.DB_SCHEMA,
  entities: [User, Topic, Comment],
  synchronize: true,
  logging: true,
};

export default config;
