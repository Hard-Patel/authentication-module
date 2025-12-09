import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Client } from 'src/modules/entities/client.entity';
import { Repository } from 'typeorm';
import { generateClientCredentials } from '../utils/generate-client-credentials';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(name: string, redirectUris: string[] = [], ownerUserId: string) {
    const { clientId, clientSecret } = generateClientCredentials();
    const client = this.clientRepo.create({
      clientId,
      clientSecretHash: await argon2.hash(clientSecret),
      name,
      redirectUris,
      ownerUserId,
    });
    await this.clientRepo.save(client);
    // IMPORTANT: return clientSecret once (raw) — show it to operator only
    return { client, clientSecret };
  }

  async findByClientId(clientId: string) {
    return this.clientRepo.findOne({ where: { clientId } });
  }

  async verifySecret(client: Client, secret: string) {
    try {
      return await argon2.verify(client.clientSecretHash, secret);
    } catch {
      return false;
    }
  }
}
