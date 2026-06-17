import { Controller, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('ai')
@Controller('issues')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Trigger Gemini AI analysis for a specific issue' })
  @ApiResponse({ status: 201, description: 'AI analysis generated and stored successfully.' })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  async analyze(@Param('id', ParseUUIDPipe) id: string) {
    return this.aiService.analyzeIssue(id);
  }
}
