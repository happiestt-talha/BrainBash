export declare class Question {
    id: string;
    categoryId: string;
    validated: boolean;
    text: string;
    options: string[];
    correctOptionIndex: number;
    createdAt: Date;
    updatedAt: Date;
}
