interface GeneratedQuestion {
    text: string;
    options: string[];
    correctOptionIndex: number;
}
export declare class LlmQuestionGeneratorService {
    private readonly logger;
    generate(categoryName: string, difficulty: string, count: number): Promise<GeneratedQuestion[]>;
    private buildPrompt;
    private parseAndValidate;
    private isValidQuestion;
}
export {};
