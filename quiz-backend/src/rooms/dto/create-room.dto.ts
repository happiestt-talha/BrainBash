import { IsString, IsOptional, IsIn, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard', 'mixed'])
  difficulty?: string;

  @IsString()
  hostDisplayName: string;
}