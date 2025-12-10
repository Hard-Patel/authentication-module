import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/device.module';
import { PublicKey } from '../entities/public-key.entity';
import { PublicKeysController } from './controller/public-key.controller';
import { PublicKeysService } from './service/public-key.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicKey]), DevicesModule],
  providers: [PublicKeysService],
  controllers: [PublicKeysController],
  exports: [PublicKeysService],
})
export class PublicKeysModule {}
