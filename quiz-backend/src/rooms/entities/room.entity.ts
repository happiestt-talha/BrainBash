import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type RoomStatus = 'lobby' | 'in_progress' | 'ended';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 6 })
  code: string;

  @Column({ nullable: true })
  hostUserId: string;

  @Column({ nullable: true })
  hostGuestSessionId: string;

  @Column()
  categoryId: string;

  @Column({ type: 'varchar', default: 'mixed' })
  difficulty: Difficulty;

  @Column({ default: 6 })
  maxPlayers: number;

  @Column({ type: 'varchar', default: 'lobby' })
  status: RoomStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  startedAt: Date;
}