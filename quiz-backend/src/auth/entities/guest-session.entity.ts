import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('guest_sessions')
export class GuestSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tempName: string;

  @Column({ unique: true })
  sessionToken: string;

  @Column({ nullable: true })
  convertedUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}