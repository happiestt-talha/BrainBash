import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionSource = 'curated' | 'llm_generated';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryId: string;

  @Column('text')
  text: string;

  @Column('jsonb')
  options: string[];

  @Column()
  correctOptionIndex: number;

  @Column({ type: 'varchar' })
  difficulty: Difficulty;

  @Column({ type: 'varchar' })
  source: QuestionSource;

  @Column('text', { nullable: true })
  generatedPrompt: string;

  @Column({ default: false })
  validated: boolean;

  @Column({ default: 0 })
  timesUsed: number;

  @CreateDateColumn()
  createdAt: Date;
}