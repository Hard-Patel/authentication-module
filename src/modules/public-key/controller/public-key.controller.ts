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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RegisterPublicKeyDto } from '../dto/public-key-register.dto';
import { PublicKeyResponseDto } from '../dto/public-key-response.dto';
import { RevokePublicKeyDto } from '../dto/revoke-public-key.dto';
import { PublicKeysService } from '../service/public-key.service';

@ApiTags('Public Keys')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('devices/:deviceId/keys')
export class PublicKeysController {
  constructor(private readonly pkService: PublicKeysService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a public key for authenticated user device',
  })
  @ApiParam({ name: 'deviceId', description: 'client-side deviceId' })
  @ApiResponse({ status: 201, type: PublicKeyResponseDto })
  async register(
    @Request() req,
    @Param('deviceId') deviceId: string,
    @Body() dto: RegisterPublicKeyDto,
  ) {
    const userId = req.user.id;
    console.log('deviceId, dto: ', deviceId, dto);
    const pk = await this.pkService.register(userId, deviceId, dto);
    return plainToInstance(PublicKeyResponseDto, pk);
  }

  @Post('revoke')
  @ApiOperation({ summary: 'Revoke a public key by keyId' })
  @ApiResponse({ status: 200, type: PublicKeyResponseDto })
  async revoke(@Request() req, @Body() dto: RevokePublicKeyDto) {
    const userId = req.user.id;
    const pk = await this.pkService.revoke(userId, dto.keyId);
    return plainToInstance(PublicKeyResponseDto, pk);
  }

  @Get()
  @ApiOperation({ summary: 'List public keys for device (active only)' })
  @ApiResponse({ status: 200, type: [PublicKeyResponseDto] })
  async list(@Request() req, @Param('deviceId') deviceId: string) {
    const userId = req.user.id;
    const keys = await this.pkService.listForDevice(userId, deviceId, true);
    return keys.map((k) => plainToInstance(PublicKeyResponseDto, k));
  }
}
