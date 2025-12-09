import 'reflect-metadata';

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  ownerUserId?: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerUserId' })
  owner?: User;

  // public client identifier used by third-parties (e.g. in Basic auth)
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  clientId: string;

  // hashed secret (bcrypt/argon2). Never store raw secret.
  @Column({ type: 'text', nullable: false })
  clientSecretHash: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  // array of allowed redirect URIs (if you support OAuth-like redirect flows)
  @Column({ type: 'text', array: true, default: [] })
  redirectUris: string[];

  // optional additional metadata (owner, contact email, etc.)
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
