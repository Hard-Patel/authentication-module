import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DevicesService } from 'src/modules/devices/service/device.service';
import { PublicKey } from 'src/modules/entities/public-key.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterPublicKeyDto } from '../dto/public-key-register.dto';

@Injectable()
export class PublicKeysService {
  private readonly logger = new Logger(PublicKeysService.name);

  constructor(
    @InjectRepository(PublicKey)
    private readonly pkRepo: Repository<PublicKey>,
    private readonly devicesService: DevicesService,
  ) {}

  /** Register a public key for a device. Ensures device exists and belongs to user. */
  async register(userId: string, deviceId: string, dto: RegisterPublicKeyDto) {
    const device = await this.devicesService.findByDeviceId(deviceId);
    if (!device) throw new NotFoundException('Device not found');
    if (device.userId !== userId)
      throw new NotFoundException('Device not found for current user');

    // ensure keyId unique per user+device — generate if missing
    const keyId = dto.keyId ?? uuidv4();

    // check uniqueness (userId+deviceId+keyId) to give a nice error before DB unique violation
    const existing = await this.pkRepo.findOne({
      where: { userId, deviceId, keyId },
    });
    if (existing)
      throw new ConflictException('keyId already exists for this device');

    const pk = this.pkRepo.create({
      keyId,
      userId,
      deviceId,
      publicKey: dto.publicKey,
      algorithm: dto.algorithm,
      isActive: true,
      metadata: dto.metadata ?? null,
    });

    return this.pkRepo.save(pk);
  }

  /** Soft-revoke by keyId (ensures ownership) */
  async revoke(userId: string, keyId: string) {
    const pk = await this.pkRepo.findOne({ where: { keyId } });
    if (!pk) throw new NotFoundException('Public key not found');
    if (pk.userId !== userId)
      throw new NotFoundException('Public key not found for user');

    pk.isActive = false;
    pk.metadata = {
      ...(pk.metadata ?? {}),
      revokedAt: new Date().toISOString(),
    };
    return this.pkRepo.save(pk);
  }

  /** List keys for device (only active by default) */
  async listForDevice(userId: string, deviceId: string, onlyActive = true) {
    const device = await this.devicesService.findByDeviceId(deviceId);
    if (!device || device.userId !== userId)
      throw new NotFoundException('Device not found');

    const where: any = { userId, deviceId };
    if (onlyActive) where.isActive = true;
    return this.pkRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  /** Find active key by keyId (used by verification flow) */
  async findActiveByKeyId(keyId: string) {
    return this.pkRepo.findOne({ where: { keyId, isActive: true } });
  }

  /** Revoke all keys for a device (used when device is revoked) */
  async revokeAllForDevice(deviceId: string) {
    await this.pkRepo
      .createQueryBuilder()
      .update()
      .set({ isActive: false })
      .where('"deviceId" = :deviceId', { deviceId })
      .execute();
  }
}
