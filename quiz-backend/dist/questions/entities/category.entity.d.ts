export type CategorySourceType = 'curated' | 'llm_generated';
export declare class Category {
    id: string;
    name: string;
    sourceType: CategorySourceType;
    icon: string;
    createdAt: Date;
}
