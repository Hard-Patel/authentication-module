import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApproveLoginDto } from '../dto/approve-login.dto';
import { TestSignDto } from '../dto/test-sign.dto';
import { MobileAuthService } from '../service/mobile-auth.service';

@ApiTags('Mobile Auth')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('mobile/login-requests')
export class MobileAuthController {
  constructor(private readonly service: MobileAuthService) {}

  @Get()
  async list(@Request() req) {
    return this.service.listPending(req.user.id);
  }

  @Post(':txId/approve')
  async approve(
    @Request() req,
    @Param('txId') txId: string,
    @Body() dto: ApproveLoginDto,
  ) {
    return this.service.approve(req.user.id, txId, dto.keyId, dto.signature);
  }

  @Post(':txId/reject')
  async reject(@Request() req, @Param('txId') txId: string) {
    return this.service.reject(req.user.id, txId);
  }

  @Post('sign')
  signForTesting(@Body() dto: TestSignDto) {
    return this.service.signPayloadForTesting(dto.payload);
  }
}
