import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/createCommentForUser/:id')
  async create(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    try {
      const comment = await this.commentService.create(+id, createCommentDto);
      return { success: true, data: comment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('findAll')
  async findAll() {
    try {
      const comments = await this.commentService.findAll();
      return { success: true, data: comments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('findCommentByUserId/:id')
  async findOne(@Param('id') id: string) {
    try {
      const comment = await this.commentService.findOne(+id);
      return { success: true, data: comment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
