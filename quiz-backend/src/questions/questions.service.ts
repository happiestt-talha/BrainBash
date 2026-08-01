import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Category } from './entities/category.entity';
import { LlmQuestionGeneratorService } from './llm-question-generator.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private llmGenerator: LlmQuestionGeneratorService,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async getByCategory(categoryId: string, limit = 50): Promise<Question[]> {
    return this.questionRepo.find({
      where: { categoryId, validated: true },
      take: limit,
    });
  }

  async generateAndStore(dto: GenerateQuestionsDto): Promise<Question[]> {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new Error('Category not found');

    const generated = await this.llmGenerator.generate(category.name, dto.difficulty, dto.count);

    const saved: Question[] = [];
    for (const g of generated) {
      const question = this.questionRepo.create({
        categoryId: dto.categoryId,
        text: g.text,
        options: g.options,
        correctOptionIndex: g.correctOptionIndex,
        difficulty: dto.difficulty as any,
        source: 'llm_generated',
        validated: true, // already passed isValidQuestion() checks
      });
      saved.push(await this.questionRepo.save(question));
    }
    return saved;
  }
}