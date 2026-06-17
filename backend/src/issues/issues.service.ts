import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc, desc, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import type { NestDb } from '../database/database.module';
import { issues, comments, aiAnalyses } from '../database/schema';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NestDb,
  ) {}

  async findMany(filters: { status?: 'open' | 'in-progress' | 'closed'; priority?: 'low' | 'medium' | 'high' }) {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(issues.status, filters.status));
    }
    if (filters.priority) {
      conditions.push(eq(issues.priority, filters.priority));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // We also want to include the comment count for each issue as requested by the frontend spec
    // ("show all issues in a table/card layout with status badge, priority badge, comment count, and date")
    // We can query this efficiently using drizzle relational query with comments count, or just standard query.
    // Drizzle relational query with comments is:
    const results = await this.db.query.issues.findMany({
      where: whereClause,
      orderBy: [desc(issues.createdAt)],
      with: {
        comments: {
          columns: {
            id: true,
          },
        },
      },
    });

    return results.map((issue) => ({
      ...issue,
      commentCount: issue.comments.length,
      comments: undefined, // remove full comments array to save bandwidth
    }));
  }

  async findOne(id: string) {
    const issue = await this.db.query.issues.findFirst({
      where: eq(issues.id, id),
      with: {
        comments: {
          orderBy: [asc(comments.createdAt)],
        },
        aiAnalyses: {
          orderBy: [desc(aiAnalyses.generatedAt)],
          limit: 1,
        },
      },
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    // Get the latest AI analysis, or null if none
    const latestAnalysis = issue.aiAnalyses && issue.aiAnalyses.length > 0 ? issue.aiAnalyses[0] : null;

    return {
      ...issue,
      latestAnalysis,
      aiAnalyses: undefined, // remove list to return single object
    };
  }

  async create(createIssueDto: CreateIssueDto) {
    const [newIssue] = await this.db
      .insert(issues)
      .values({
        title: createIssueDto.title,
        description: createIssueDto.description,
        status: createIssueDto.status || 'open',
        priority: createIssueDto.priority || 'medium',
      })
      .returning();

    return newIssue;
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    // Check if issue exists
    await this.findOne(id);

    const [updatedIssue] = await this.db
      .update(issues)
      .set({
        ...updateIssueDto,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, id))
      .returning();

    return updatedIssue;
  }
}
