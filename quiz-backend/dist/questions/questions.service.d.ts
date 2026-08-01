import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Category } from './entities/category.entity';
import { LlmQuestionGeneratorService } from './llm-question-generator.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
export declare class QuestionsService {
    private questionRepo;
    private categoryRepo;
    private llmGenerator;
    constructor(questionRepo: Repository<Question>, categoryRepo: Repository<Category>, llmGenerator: LlmQuestionGeneratorService);
    getCategories(): Promise<Category[]>;
    getByCategory(categoryId: string, limit?: number): Promise<Question[]>;
    generateAndStore(dto: GenerateQuestionsDto): Promise<Question[]>;
}
