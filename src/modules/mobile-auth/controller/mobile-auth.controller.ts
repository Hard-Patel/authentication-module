import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MobileAuthService } from '../service/mobile-auth.service';
import { ApproveLoginDto } from '../dto/approve-login.dto';
import { RejectLoginDto } from '../dto/reject-login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Mobile Auth')
@ApiBearerAuth()
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
}
