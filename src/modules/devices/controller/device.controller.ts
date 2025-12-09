import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DeviceResponseDto } from '../dtos/device-response.dto';
import { RegisterDeviceDto } from '../dtos/register.dto';
import { UpdateDeviceDto } from '../dtos/update-device.dto';
import { DevicesService } from '../service/device.service';

@ApiTags('Device')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register or update a device for the authenticated user',
  })
  @ApiResponse({ status: 201, type: DeviceResponseDto })
  async register(@Request() req, @Body() dto: RegisterDeviceDto) {
    const userId = req.user.id;
    const device = await this.devicesService.registerOrUpdate(userId, dto);
    return plainToInstance(DeviceResponseDto, device);
  }

  @Patch(':deviceId')
  @ApiOperation({ summary: 'Update device metadata' })
  @ApiResponse({ status: 200, type: DeviceResponseDto })
  async update(
    @Request() req,
    @Param('deviceId') deviceId: string,
    @Body() dto: UpdateDeviceDto,
  ) {
    const userId = req.user.id;
    const device = await this.devicesService.update(userId, deviceId, dto);
    return plainToInstance(DeviceResponseDto, device);
  }

  @Get()
  @ApiOperation({ summary: 'List devices for authenticated user' })
  @ApiResponse({ status: 200, type: [DeviceResponseDto] })
  async list(@Request() req) {
    const userId = req.user.id;
    const devices = await this.devicesService.listForUser(userId);
    return devices.map((d) => plainToInstance(DeviceResponseDto, d));
  }
}
