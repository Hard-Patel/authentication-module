import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/client.module';
import { DevicesModule } from './modules/devices/device.module';
import { LoginTransactionsModule } from './modules/login-transactions/login-transaction.module';
import { PublicKeysModule } from './modules/public-key/public-key.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientsModule,
    DevicesModule,
    PublicKeysModule,
    LoginTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
