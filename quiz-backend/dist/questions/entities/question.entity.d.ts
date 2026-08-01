export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionSource = 'curated' | 'llm_generated';
export declare class Question {
    id: string;
    categoryId: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
    difficulty: Difficulty;
    source: QuestionSource;
    generatedPrompt: string;
    validated: boolean;
    timesUsed: number;
    createdAt: Date;
}
