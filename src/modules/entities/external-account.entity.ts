import 'reflect-metadata';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from './client.entity';
import { User } from './user.entity';
@Entity('external_accounts')
@Unique(['clientId', 'externalUserId'])
@Unique(['clientId', 'authUserId'])
@Index(['clientId', 'authUserId'])
export class ExternalAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  clientId: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'clientId' })
  client: Client;

  @Column({ type: 'varchar', length: 255 })
  externalUserId: string;

  @Column({ type: 'uuid' })
  authUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authUserId' })
  authUser: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  linkedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
