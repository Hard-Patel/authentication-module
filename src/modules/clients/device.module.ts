import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesController } from '../devices/controller/device.controller';
import { DevicesService } from '../devices/service/device.service';
import { Device } from '../entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
