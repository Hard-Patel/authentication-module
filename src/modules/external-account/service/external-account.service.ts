import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExternalAccount } from '../../entities/external-account.entity';

@Injectable()
export class ExternalAccountsService {
  constructor(
    @InjectRepository(ExternalAccount)
    private readonly repo: Repository<ExternalAccount>,
  ) {}

  /** Link client user ↔ BioAuth user */
  async link(
    clientId: string,
    externalUserId: string,
    authUserId: string,
    metadata?: Record<string, unknown>,
  ) {
    const existing = await this.repo.findOne({
      where: [
        { clientId, externalUserId },
        { clientId, authUserId },
      ],
    });

    if (existing) {
      // already linked — return existing mapping
      return existing;
    }

    try {
      const link = this.repo.create({
        clientId,
        externalUserId,
        authUserId,
        metadata: metadata ?? null,
      });

      return await this.repo.save(link);
    } catch (err) {
      throw new ConflictException('External account already linked');
    }
  }

  /** Resolve auth user from client + external user */
  async findByClientAndExternalUser(clientId: string, externalUserId: string) {
    return this.repo.findOne({
      where: { clientId, externalUserId },
    });
  }

  /** Check if a mapping exists */
  async isLinked(clientId: string, externalUserId: string): Promise<boolean> {
    const found = await this.findByClientAndExternalUser(
      clientId,
      externalUserId,
    );
    return !!found;
  }
}
