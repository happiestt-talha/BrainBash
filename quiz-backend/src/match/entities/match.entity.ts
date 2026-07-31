import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type MatchStatus = 'active' | 'completed' | 'abandoned';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  totalQuestions: number;

  @Column({ type: 'varchar', default: 'active' })
  status: MatchStatus;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;
}