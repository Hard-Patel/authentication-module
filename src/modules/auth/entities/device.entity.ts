import 'reflect-metadata';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from './user.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // device-generated identifier (can be a UUID, vendor id, or random string)
  // NOT the DB primary key — this helps when the same device registers multiple times.
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  deviceId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (u) => u.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  platform: string; // e.g. 'ios' | 'android'

  @Column({ type: 'text', nullable: true })
  pushToken?: string | null; // FCM/APNs token (consider encrypting at rest)

  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceModel?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  osVersion?: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  appVersion?: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
