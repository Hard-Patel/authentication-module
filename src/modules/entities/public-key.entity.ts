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

import { Device } from './device.entity';
import { User } from './user.entity';

@Entity('public_keys')
@Index(['userId', 'deviceId'])
@Unique(['userId', 'deviceId', 'keyId'])
export class PublicKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // now stores the device PK (uuid) not the client deviceId string
  @Column({ type: 'uuid' })
  deviceId: string;

  @ManyToOne(() => Device, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deviceId' }) // references Device.id by default
  device: Device;

  @Column({ type: 'varchar', length: 255, nullable: true })
  keyId?: string | null;

  @Column({ type: 'text' })
  publicKey: string;

  @Column({ type: 'varchar', length: 32 })
  algorithm: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
