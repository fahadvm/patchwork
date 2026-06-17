import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import type { NestDb } from '../database/database.module';
import { comments, issues } from '../database/schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { IssuesService } from '../issues/issues.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NestDb,
    private readonly issuesService: IssuesService,
  ) {}

  async create(issueId: string, createCommentDto: CreateCommentDto) {
    // 1. Verify issue exists (throws NotFoundException if not)
    await this.issuesService.findOne(issueId);

    // 2. Insert comment
    const [newComment] = await this.db
      .insert(comments)
      .values({
        issueId,
        body: createCommentDto.body,
        authorName: createCommentDto.authorName,
      })
      .returning();

    // 3. Update issue's updatedAt timestamp
    await this.db
      .update(issues)
      .set({ updatedAt: new Date() })
      .where(eq(issues.id, issueId));

    return newComment;
  }
}
