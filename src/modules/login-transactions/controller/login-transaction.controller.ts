import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ClientCredentialsGuard } from 'src/modules/auth/guards/client-credentials.guard';
import { ExchangeAuthCodeDto } from '../dto/exchange-auth.dto';
import { InitLoginDto } from '../dto/init-login.dto';
import { LoginStatusResponseDto } from '../dto/login-status.res';
import { LoginTransactionResponseDto } from '../dto/login-transaction.response';
import { LoginTransactionsService } from '../service/login-transaction.service';

@ApiTags('Login Transaction')
@UseGuards(ClientCredentialsGuard)
@ApiBasicAuth('client-basic')
@Controller('clients/login')
export class LoginTransactionsController {
  constructor(private readonly txService: LoginTransactionsService) {}

  @Post('init')
  @ApiOperation({ summary: 'Client: initiate login for an external user' })
  @ApiResponse({ status: 201, type: LoginTransactionResponseDto })
  async init(@Request() req, @Body() dto: InitLoginDto) {
    // clientId available via client credentials guard (e.g., req.client.clientId)
    const clientId =
      req.client?.clientId ?? req.user?.clientId ?? 'unknown-client';
    const { txId, challenge, expiresAt } = await this.txService.init(
      clientId,
      dto.externalUserId,
      dto.authUserId ?? null,
      dto.ttlSeconds ?? 60,
    );
    return plainToInstance(LoginTransactionResponseDto, {
      txId,
      challenge,
      expiresAt,
    });
  }

  @Get('status/:txId')
  @ApiOperation({ summary: 'Client: poll transaction status' })
  @ApiResponse({ status: 200, type: LoginStatusResponseDto })
  async status(@Param('txId') txId: string) {
    const s = await this.txService.getStatus(txId);
    return plainToInstance(LoginStatusResponseDto, s);
  }

  @Post('exchange')
  @ApiOperation({
    summary: 'Client: exchange one-time auth code for mapped authUserId',
  })
  @ApiResponse({ status: 200 })
  async exchange(@Body() dto: ExchangeAuthCodeDto) {
    const res = await this.txService.exchangeAuthCode(dto.txId, dto.authCode);
    return res;
  }
}
