import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CompleteExternalLinkDto } from '../dto/complete-link.dto';
import { ExternalAccountsService } from '../service/external-account.service';

@ApiTags('External Account (Mobile)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mobile/external-accounts')
export class ExternalAccountsMobileController {
  constructor(private readonly service: ExternalAccountsService) {}

  @Post('link')
  @ApiOperation({ summary: 'Mobile user approves external account linking' })
  async completeLink(@Request() req, @Body() dto: CompleteExternalLinkDto) {
    const authUserId = req.user.id;

    const link = await this.service.link(
      dto.clientId,
      dto.externalUserId,
      authUserId,
      dto.metadata,
    );

    return {
      success: true,
      clientId: link.clientId,
      externalUserId: link.externalUserId,
      authUserId: link.authUserId,
    };
  }
}
