import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from '../database/database.module';
import type { NestDb } from '../database/database.module';
import { aiAnalyses } from '../database/schema';
import { IssuesService } from '../issues/issues.service';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NestDb,
    private readonly issuesService: IssuesService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey.trim() !== '') {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn(
        'Warning: GEMINI_API_KEY is not set. The AI Analysis will run in mock mode.',
      );
    }
  }

  async analyzeIssue(issueId: string) {
    // 1. Fetch issue with comments (throws if not found)
    const issue = await this.issuesService.findOne(issueId);

    let rawResponseText = '';

    if (this.genAI) {
      const commentsText = issue.comments && issue.comments.length > 0
        ? issue.comments
            .map((c) => `Author: ${c.authorName}\nComment: ${c.body}`)
            .join('\n\n')
        : 'No comments added yet.';

      const prompt = `You are an expert systems analyst. Analyze the following issue and comment thread.

Issue Title: ${issue.title}
Issue Description: ${issue.description}

Comments:
${commentsText}

Return a structured JSON object with these EXACT keys:
{
  "summary": "A brief 2-3 sentence overview of the issue and its current status.",
  "keyThemes": ["theme1", "theme2"],
  "nextSteps": ["action1", "action2"],
  "sentiment": "Overall tone of the discussion (e.g. Urgent, Collaborative, Confused, Neutral)"
}`;

      const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'];
      let lastError: unknown = null;
      let success = false;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting Gemini analysis with model: ${modelName}`);
          const model = this.genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' },
          });
          const result = await model.generateContent(prompt);
          rawResponseText = result.response.text();
          success = true;
          console.log(`Successfully completed analysis using model: ${modelName}`);
          break;
        } catch (err) {
          console.warn(`Failed to analyze issue with model ${modelName}:`, err);
          lastError = err;
        }
      }

      if (!success) {
        console.error('All Gemini models failed:', lastError);
        throw new BadRequestException(
          `Failed to call Gemini API (all models exhausted): ${lastError instanceof Error ? lastError.message : String(lastError)}`,
        );
      }
    } else {
      // Mock mode fallback when no API key is set
      const mockAnalysis = {
        summary: `[Mock Analysis - Gemini Key Not Provided] This is a mock analysis for issue: "${issue.title}". The description mentions: "${issue.description.substring(0, 100)}...".`,
        keyThemes: ['Local Mock Mode', 'Configuration Pending', 'Issue Tracking'],
        nextSteps: [
          'Add a valid GEMINI_API_KEY to backend/.env',
          'Restart the backend NestJS application',
          'Trigger AI analysis again to fetch real insights',
        ],
        sentiment: 'Configuration Required',
      };
      rawResponseText = JSON.stringify(mockAnalysis, null, 2);
    }

    // 2. Persist in ai_analyses table
    const [newAnalysis] = await this.db
      .insert(aiAnalyses)
      .values({
        issueId,
        summary: rawResponseText,
      })
      .returning();

    return newAnalysis;
  }
}
