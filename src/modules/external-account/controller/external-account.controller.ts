import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientCredentialsGuard } from '../../auth/guards/client-credentials.guard';
import { InitExternalLinkDto } from '../dto/init-line.dto';
import { ExternalAccountsService } from '../service/external-account.service';

@ApiTags('External Account (Client)')
@UseGuards(ClientCredentialsGuard)
@ApiBasicAuth('client-basic')
@Controller('external-accounts')
export class ExternalAccountsClientController {
  constructor(private readonly service: ExternalAccountsService) {}

  @Post('link/init')
  @ApiOperation({ summary: 'Client initiates external account linking' })
  @ApiResponse({ status: 200 })
  async initLink(@Request() req, @Body() dto: InitExternalLinkDto) {
    const clientId = req.client.clientId;

    const alreadyLinked = await this.service.isLinked(
      clientId,
      dto.externalUserId,
    );

    return {
      clientId,
      externalUserId: dto.externalUserId,
      linked: alreadyLinked,
      // Client should now instruct user to open BioAuth mobile app
    };
  }
}
