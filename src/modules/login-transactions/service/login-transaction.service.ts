import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { DevicesService } from 'src/modules/devices/service/device.service';
import {
  LoginTransaction,
  LoginTxStatus,
} from 'src/modules/entities/login-transactions.entity';
import { PublicKeysService } from 'src/modules/public-key/service/public-key.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PushService } from './push.service';

@Injectable()
export class LoginTransactionsService {
  private readonly logger = new Logger(LoginTransactionsService.name);

  constructor(
    @InjectRepository(LoginTransaction)
    private readonly repo: Repository<LoginTransaction>,
    private readonly devicesService: DevicesService,
    private readonly publicKeysService: PublicKeysService,
    private readonly pushService: PushService,
  ) {}

  private generateChallenge() {
    return crypto.randomBytes(32).toString('base64');
  }

  private generateAuthCodePlain() {
    // 8 digit numeric code (or choose other format)
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  private hashAuthCode(code: string) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Create & persist a login transaction and push to user's devices (best effort).
   * clientId is the calling client's public clientId (string).
   */
  async init(
    clientId: string,
    externalUserId: string,
    authUserId: string | null,
    ttlSeconds = 60,
  ) {
    const txId = uuidv4();
    const challenge = this.generateChallenge();
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const tx = this.repo.create({
      txId,
      clientId,
      externalUserId,
      authUserId: authUserId ?? null,
      challenge,
      status: LoginTxStatus.PENDING,
      expiresAt,
    });

    await this.repo.save(tx);

    // push to devices owned by authUserId if present, otherwise attempt to find devices for external mapping later
    if (authUserId) {
      // find devices for user
      const devices = await this.devicesService.listForUser(authUserId);
      for (const d of devices) {
        try {
          await this.pushService.send(d.pushToken, {
            type: 'login_request',
            txId,
            clientId,
            externalUserId,
            challenge,
          });
        } catch (err) {
          this.logger.warn(
            `Push failed for device ${d.deviceId}: ${err?.message ?? err}`,
          );
        }
      }
    } else {
      // best-effort: log (client will poll status)
      this.logger.log(`Transaction ${txId} created without mapped authUserId`);
    }

    return { txId, challenge, expiresAt };
  }

  async getStatus(txId: string) {
    const tx = await this.repo.findOne({ where: { txId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    // expire checks
    if (tx.status === LoginTxStatus.PENDING && tx.expiresAt < new Date()) {
      tx.status = LoginTxStatus.EXPIRED;
      await this.repo.save(tx);
    }

    return {
      txId: tx.txId,
      status: tx.status,
      expiresAt: tx.expiresAt,
      authUserId: tx.authUserId ?? null,
    };
  }

  /**
   * Called by MobileAuthModule after verifying signature.
   * This will mark tx APPROVED and issue one-time auth code (plaintext returned to mobile so it can show or exchange).
   */
  async markApproved(
    txId: string,
    approverDeviceUuid: string,
    authUserId?: string | null,
  ) {
    const tx = await this.repo.findOne({ where: { txId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.status !== LoginTxStatus.PENDING) {
      throw new BadRequestException('Transaction not in pending state');
    }
    if (tx.expiresAt < new Date()) {
      tx.status = LoginTxStatus.EXPIRED;
      await this.repo.save(tx);
      throw new BadRequestException('Transaction expired');
    }

    // set approval metadata
    tx.status = LoginTxStatus.APPROVED;
    tx.approvedByDeviceId = approverDeviceUuid;
    if (authUserId) tx.authUserId = authUserId;

    // issue one-time auth code (plaintext to return to mobile; hashed for storage)
    const authCodePlain = this.generateAuthCodePlain();
    tx.authCodeHash = this.hashAuthCode(authCodePlain);

    await this.repo.save(tx);

    // return plaintext authCode so client can supply to third-party via redirect or popup
    return { txId: tx.txId, authCode: authCodePlain, expiresAt: tx.expiresAt };
  }

  async markRejected(txId: string, approverDeviceUuid: string) {
    const tx = await this.repo.findOne({ where: { txId } });
    if (!tx) throw new NotFoundException('Transaction not found');
    if (tx.status !== LoginTxStatus.PENDING)
      throw new BadRequestException('Transaction not in pending state');

    tx.status = LoginTxStatus.REJECTED;
    tx.approvedByDeviceId = approverDeviceUuid;
    await this.repo.save(tx);
    return tx;
  }

  /**
   * Client exchanges authCode for login success. Returns authUserId if OK.
   */
  async exchangeAuthCode(txId: string, authCodePlain: string) {
    const tx = await this.repo.findOne({ where: { txId } });
    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.status !== LoginTxStatus.APPROVED) {
      throw new BadRequestException('Transaction not approved');
    }
    if (tx.expiresAt < new Date()) {
      tx.status = LoginTxStatus.EXPIRED;
      await this.repo.save(tx);
      throw new BadRequestException('Transaction expired');
    }
    // validate auth code
    const hash = this.hashAuthCode(authCodePlain);
    if (!tx.authCodeHash || hash !== tx.authCodeHash) {
      throw new BadRequestException('Invalid auth code');
    }

    // one-time use: mark used
    tx.status = LoginTxStatus.USED;
    // clear authCodeHash for extra safety
    tx.authCodeHash = null;
    await this.repo.save(tx);

    // return mapping (client receives authUserId or fails)
    return {
      authUserId: tx.authUserId ?? null,
      externalUserId: tx.externalUserId,
    };
  }

  /**
   * Utility: find transaction for verification during mobile approval
   */
  async findByTxId(txId: string) {
    return this.repo.findOne({ where: { txId } });
  }

  async findPendingForUser(userId: string) {
    return this.repo.find({
      where: {
        authUserId: userId,
        status: LoginTxStatus.PENDING,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
