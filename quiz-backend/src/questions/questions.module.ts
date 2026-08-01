import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Category } from './entities/category.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { LlmQuestionGeneratorService } from './llm-question-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Category])],
  providers: [QuestionsService, LlmQuestionGeneratorService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}