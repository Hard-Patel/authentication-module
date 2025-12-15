import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesModule } from '../devices/device.module';
import { LoginTransaction } from '../entities/login-transactions.entity';
import { PublicKeysModule } from '../public-key/public-key.module';
import { LoginTransactionsController } from './controller/login-transaction.controller';
import { LoginTransactionsService } from './service/login-transaction.service';
import { PushService } from './service/push.service';
import { ClientsModule } from '../clients/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginTransaction]),
    forwardRef(() => ClientsModule),
    forwardRef(() => DevicesModule),
    forwardRef(() => PublicKeysModule),
  ],
  providers: [LoginTransactionsService, PushService],
  controllers: [LoginTransactionsController],
  exports: [LoginTransactionsService],
})
export class LoginTransactionsModule {}
