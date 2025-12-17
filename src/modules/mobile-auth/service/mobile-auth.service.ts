import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { LoginTransactionsService } from 'src/modules/login-transactions/service/login-transaction.service';
import { PublicKeysService } from 'src/modules/public-key/service/public-key.service';
import { TEST_PRIVATE_KEY } from '../crypto/test-private-key';
import { verifySignature } from '../utils/verification';

@Injectable()
export class MobileAuthService {
  constructor(
    private readonly txService: LoginTransactionsService,
    private readonly publicKeysService: PublicKeysService,
  ) {}

  async listPending(userId: string) {
    return this.txService.findPendingForUser(userId);
  }

  async approve(
    userId: string,
    txId: string,
    keyId: string,
    signature: string,
  ) {
    const tx = await this.txService.findByTxId(txId);
    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.authUserId !== userId) {
      throw new BadRequestException('Transaction does not belong to user');
    }

    const pk = await this.publicKeysService.findActiveByKeyId(keyId);
    if (!pk) throw new BadRequestException('Invalid or revoked key');

    const isValid = await verifySignature({
      publicKey: pk.publicKey,
      algorithm: pk.algorithm,
      challenge: tx.challenge,
      signature,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    return this.txService.markApproved(tx.txId, pk.deviceId, userId);
  }

  async reject(userId: string, txId: string) {
    const tx = await this.txService.findByTxId(txId);
    if (!tx) throw new NotFoundException('Transaction not found');

    if (tx.authUserId !== userId) {
      throw new BadRequestException('Transaction does not belong to user');
    }

    return this.txService.markRejected(tx.txId, userId);
  }

  signPayloadForTesting(payload: Record<string, any>) {
    // IMPORTANT: deterministic stringification
    const payloadString = JSON.stringify(payload);
    console.log('payloadString: ', payloadString);

    console.log('TEST_PRIVATE_KEY: ', TEST_PRIVATE_KEY);
    const signature = crypto.sign(
      'sha256',
      Buffer.from(payloadString),
      TEST_PRIVATE_KEY,
    );

    return {
      payload: payloadString,
      signature: signature.toString('base64'),
    };
  }
}
