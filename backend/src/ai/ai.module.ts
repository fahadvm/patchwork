import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [IssuesModule, ConfigModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
