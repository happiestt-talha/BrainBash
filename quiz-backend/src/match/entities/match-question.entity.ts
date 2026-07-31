import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('match_questions')
export class MatchQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  questionId: string;

  @Column()
  questionIndex: number;

  @Column({ type: 'bigint', nullable: true })
  pushedAt: number | null; // epoch ms

  @Column()
  timeLimitMs: number;
}