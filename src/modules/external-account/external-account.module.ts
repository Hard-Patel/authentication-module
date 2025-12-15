import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/client.module';
import { ExternalAccount } from '../entities/external-account.entity';
import { ExternalAccountsClientController } from './controller/external-account.controller';
import { ExternalAccountsMobileController } from './controller/external-account.mobile';
import { ExternalAccountsService } from './service/external-account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalAccount]),
    forwardRef(() => ClientsModule),
  ],
  providers: [ExternalAccountsService],
  controllers: [
    ExternalAccountsClientController,
    ExternalAccountsMobileController,
  ],
  exports: [ExternalAccountsService],
})
export class ExternalAccountsModule {}
