import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@ApiTags('issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve list of all issues with optional filtering' })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'in-progress', 'closed'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high'] })
  @ApiResponse({ status: 200, description: 'Return issues list.' })
  async findMany(
    @Query('status') status?: 'open' | 'in-progress' | 'closed',
    @Query('priority') priority?: 'low' | 'medium' | 'high',
  ) {
    return this.issuesService.findMany({ status, priority });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a single issue by ID' })
  @ApiResponse({ status: 200, description: 'Return issue details with comments and AI analysis.' })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.issuesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'The issue has been successfully created.' })
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an issue status or priority' })
  @ApiResponse({ status: 200, description: 'The issue has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Issue not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.issuesService.update(id, updateIssueDto);
  }
}
