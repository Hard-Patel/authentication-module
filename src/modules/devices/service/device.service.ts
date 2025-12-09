import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/modules/entities/device.entity';
import { Repository } from 'typeorm';
import { RegisterDeviceDto } from '../dtos/register.dto';
import { UpdateDeviceDto } from '../dtos/update-device.dto';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  /**
   * Register or update a device for the given userId.
   * deviceId is globally unique per your entity; if it exists but belongs to another user => reject.
   */
  async registerOrUpdate(userId: string, dto: RegisterDeviceDto) {
    const existing = await this.deviceRepo.findOne({
        where: { deviceId: dto.deviceId },
    });

    if (existing) {
      if (existing.userId !== userId) {
        // security decision: reject re-claiming a deviceId that already belongs to another user
        this.logger.warn(
          `Device ${dto.deviceId} attempted register by user ${userId} but owned by ${existing.userId}`,
        );
        throw new ConflictException(
          'Device ID already registered by another user',
        );
      }

      existing.platform = dto.platform;
      existing.pushToken = dto.pushToken ?? existing.pushToken;
      existing.deviceModel = dto.deviceModel ?? existing.deviceModel;
      existing.osVersion = dto.osVersion ?? existing.osVersion;
      existing.appVersion = dto.appVersion ?? existing.appVersion;
      existing.isActive = true;
      existing.lastSeenAt = new Date();

      return this.deviceRepo.save(existing);
    }

    const device = this.deviceRepo.create({
      deviceId: dto.deviceId,
      userId,
      platform: dto.platform,
      pushToken: dto.pushToken ?? null,
      deviceModel: dto.deviceModel ?? null,
      osVersion: dto.osVersion ?? null,
      appVersion: dto.appVersion ?? null,
      isActive: true,
      lastSeenAt: new Date(),
    });

    return this.deviceRepo.save(device);
  }

  async update(userId: string, deviceId: string, dto: UpdateDeviceDto) {
    const device = await this.deviceRepo.findOne({ where: { deviceId } });
    if (!device || device.userId !== userId) {
      throw new NotFoundException('Device not found');
    }

    if (dto.pushToken !== undefined) device.pushToken = dto.pushToken;
    if (dto.deviceModel !== undefined) device.deviceModel = dto.deviceModel;
    if (dto.osVersion !== undefined) device.osVersion = dto.osVersion;
    if (dto.appVersion !== undefined) device.appVersion = dto.appVersion;
    if (dto.isActive !== undefined) device.isActive = dto.isActive;
    if (dto.touchLastSeen) device.lastSeenAt = new Date();

    return this.deviceRepo.save(device);
  }

  async listForUser(userId: string) {
    return this.deviceRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findByDeviceId(deviceId: string) {
    return this.deviceRepo.findOne({ where: { deviceId } });
  }

  async revokeForUser(userId: string, deviceId: string) {
    const device = await this.deviceRepo.findOne({ where: { deviceId } });
    if (!device || device.userId !== userId)
      throw new NotFoundException('Device not found');
    device.isActive = false;
    return this.deviceRepo.save(device);
  }
}
