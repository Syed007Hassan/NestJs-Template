import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'The text of the comment' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ description: 'The ID of the user who posted the comment' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
