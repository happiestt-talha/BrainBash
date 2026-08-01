import { QuestionsService } from './questions.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
export declare class QuestionsController {
    private questionsService;
    constructor(questionsService: QuestionsService);
    getByCategory(categoryId: string): Promise<import("./entities/question.entity").Question[]>;
    generate(dto: GenerateQuestionsDto): Promise<import("./entities/question.entity").Question[]>;
}
