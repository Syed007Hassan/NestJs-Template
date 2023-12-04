import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  text: string;

  @ManyToOne((type) => User, (user) => user.comments)
  @JoinColumn({ name: 'id' })
  user: User;
}
