import { QuestionsService } from './questions.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
export declare class QuestionsController {
    private questionsService;
    constructor(questionsService: QuestionsService);
    getCategories(): Promise<import("./entities/category.entity").Category[]>;
    getByCategory(categoryId: string): Promise<import("./entities/question.entity").Question[]>;
    generate(dto: GenerateQuestionsDto): Promise<import("./entities/question.entity").Question[]>;
}
