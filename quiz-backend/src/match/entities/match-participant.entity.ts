import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ConnectionStatus = 'connected' | 'disconnected';

@Entity('match_participants')
export class MatchParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  guestSessionId: string;

  @Column()
  displayName: string;

  @Column({ type: 'varchar', length: 1, nullable: true })
  team: 'A' | 'B' | null;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  bestStreak: number;

  @Column({ type: 'varchar', default: 'connected' })
  connectionStatus: ConnectionStatus;

  @Column({ nullable: true })
  socketId: string; // maps live socket.id -> participant, needed for disconnect/answer lookups

  @CreateDateColumn()
  joinedAt: Date;
}