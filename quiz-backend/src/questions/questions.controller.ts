import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  getByCategory(@Query('categoryId') categoryId: string) {
    return this.questionsService.getByCategory(categoryId);
  }

  @Post('generate')
  generate(@Body() dto: GenerateQuestionsDto) {
    return this.questionsService.generateAndStore(dto);
  }
}