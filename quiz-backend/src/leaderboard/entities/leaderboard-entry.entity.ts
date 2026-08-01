import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('leaderboard_entries')
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  matchParticipantId: string;

  @Column()
  finalRank: number;

  @Column()
  finalScore: number;

  @CreateDateColumn()
  createdAt: Date;
}