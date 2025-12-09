import 'reflect-metadata';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';

import { User } from './user.entity';
import { Client } from './client.entity';

@Entity('external_accounts')
@Unique(['clientId', 'externalUserId'])
@Unique(['clientId', 'authUserId'])
export class ExternalAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Which third-party app this mapping belongs to
  @Column({ type: 'varchar', length: 100 })
  @Index()
  clientId: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId', referencedColumnName: 'clientId' })
  client: Client;

  // Third-party's user identifier (their system)
  @Column({ type: 'varchar', length: 255 })
  externalUserId: string;

  // Your platform user (auth user)
  @Column({ type: 'uuid' })
  authUserId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authUserId' })
  authUser: User;

  // Optional data the third-party wants to store
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @CreateDateColumn()
  linkedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
