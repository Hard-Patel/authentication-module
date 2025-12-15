import 'reflect-metadata';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LoginTxStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
}

@Entity('login_transactions')
@Index(['clientId', 'status'])
@Index(['expiresAt'])
@Index(['txId'])
export class LoginTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // public transaction id used by clients (safe to expose)
  @Column({ type: 'varchar', length: 128, unique: true })
  txId: string;

  // client initiating the login (clientId from clients table)
  @Column({ type: 'varchar', length: 100 })
  clientId: string;

  // optional: the third-party's user id (their identifier)
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalUserId?: string | null;

  // optional: mapped auth user id (your internal user) - filled when mapping exists
  @Column({ type: 'uuid', nullable: true })
  authUserId?: string | null;

  // challenge (server-generated) — store as base64url or hex string
  @Column({ type: 'text' })
  challenge: string;

  // status: PENDING | APPROVED | REJECTED | EXPIRED
  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: LoginTxStatus;

  // when this transaction expires and should be marked EXPIRED
  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  // optional: one-time auth code produced when approved (store hashed)
  @Column({ type: 'varchar', length: 255, nullable: true })
  authCodeHash?: string | null;

  // optional: device id used to approve (store DB device UUID for relational integrity)
  @Column({ type: 'uuid', nullable: true })
  approvedByDeviceId?: string | null;

  // optional metadata: IP, user agent, redirect_uri etc.
  @Column({ type: 'jsonb', nullable: true })
  meta?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
