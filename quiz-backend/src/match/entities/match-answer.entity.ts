import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('match_answers')
export class MatchAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchParticipantId: string;

  @Column()
  matchQuestionId: string;

  @Column({ type: 'int', nullable: true })
  selectedOptionIndex: number | null;

  @Column()
  isCorrect: boolean;

  @CreateDateColumn()
  answeredAt: Date;

  @Column()
  elapsedMs: number;

  @Column()
  pointsEarned: number;

  @Column()
  streakAtTime: number;
}