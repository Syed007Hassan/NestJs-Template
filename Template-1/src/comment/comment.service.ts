import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from 'src/entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly userService: UserService,
  ) {}

  async create(id: number, createCommentDto: CreateCommentDto) {
    const findUser = await this.userService.findOne(id);

    if (!findUser) {
      throw new Error('User not found');
    }

    const userComment = this.commentRepo.create({
      text: createCommentDto.text,
      user: findUser,
    });

    await this.commentRepo.save(userComment);

    return userComment;
  }

  findAll() {
    const comments = this.commentRepo.find();

    if (!comments) {
      throw new Error('Comments not found');
    }

    return comments;
  }

  async findOne(id: number) {
    const commentByUserId = await this.commentRepo.find({
      relations: ['user'],
      where: { user: { id: id } },
    });

    if (commentByUserId.length === 0) {
      throw new Error('Comment not found');
    }

    return commentByUserId;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
