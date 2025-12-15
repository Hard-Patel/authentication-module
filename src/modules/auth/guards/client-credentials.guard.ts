import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientsService } from 'src/modules/clients/service/clients.service';

@Injectable()
export class ClientCredentialsGuard implements CanActivate {
  constructor(private readonly clientsService: ClientsService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'] || req.headers['Authorization'];

    // Support Basic <base64(clientId:clientSecret)>
    if (!auth || typeof auth !== 'string' || !auth.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing Basic auth header');
    }

    const b64 = auth.slice('Basic '.length);
    let decoded: string;
    try {
      decoded = Buffer.from(b64, 'base64').toString('utf8');
    } catch (e) {
      throw new UnauthorizedException('Invalid Basic auth encoding');
    }

    const [clientId, clientSecret] = decoded.split(':');
    if (!clientId || !clientSecret)
      throw new UnauthorizedException('Invalid Basic auth format');

    const client = await this.clientsService.findByClientId(clientId);
    if (!client) throw new UnauthorizedException('Unknown client');

    const valid = await this.clientsService.verifySecret(client, clientSecret);
    if (!valid) throw new UnauthorizedException('Invalid client credentials');

    // attach client to request for controllers/services
    req.client = {
      id: client.id,
      clientId: client.clientId,
      name: client.name,
    };
    return true;
  }
}
