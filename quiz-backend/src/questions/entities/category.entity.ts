import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type CategorySourceType = 'curated' | 'llm_generated';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar' })
  sourceType: CategorySourceType;

  @Column({ nullable: true })
  icon: string;

  @CreateDateColumn()
  createdAt: Date;
}