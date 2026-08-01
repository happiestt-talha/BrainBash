import { IsUUID, IsInt, Min, Max, IsIn } from 'class-validator';

export class GenerateQuestionsDto {
  @IsUUID()
  categoryId: string;

  @IsInt()
  @Min(1)
  @Max(20)
  count: number;

  @IsIn(['easy', 'medium', 'hard'])
  difficulty: string;
}