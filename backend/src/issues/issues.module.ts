import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService], // Export so comments or AI modules can use it if needed
})
export class IssuesModule {}
