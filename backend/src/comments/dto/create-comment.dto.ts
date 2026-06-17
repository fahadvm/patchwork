import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment.', description: 'The body text of the comment' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  body: string;

  @ApiProperty({ example: 'John Doe', description: 'The author of the comment' })
  @IsString()
  @IsNotEmpty()
  authorName: string;
}
