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
  Unique,
} from 'typeorm';

import { User } from './user.entity';
import { Device } from './device.entity';

@Entity('public_keys')
@Index(['userId', 'deviceId'])
@Unique(['userId', 'deviceId', 'keyId'])
export class PublicKey {
  @Column({ type: 'uuid', unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // user owning the key
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // device identifier that created the key
  @Column({ type: 'varchar', length: 255 })
  deviceId: string;

  @ManyToOne(() => Device, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deviceId', referencedColumnName: 'deviceId' })
  device: Device;

  // Optional key identifier (kid) to support multiple keys per device if needed
  @Column({ type: 'varchar', length: 255, nullable: true })
  keyId?: string | null;

  // The public key material (PEM / JWK JSON string)
  @Column({ type: 'text' })
  publicKey: string;

  // algorithm used to sign: ES256, RS256, PS256, etc.
  @Column({ type: 'varchar', length: 32 })
  algorithm: string;

  // whether the key is active (revoked keys should be set to false)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // optional metadata (attestation, certificate chain, created_by, etc.)
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
