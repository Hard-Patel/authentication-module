import { Module, forwardRef } from '@nestjs/common';
import { LoginTransactionsModule } from '../login-transactions/login-transaction.module';
import { PublicKeysModule } from '../public-key/public-key.module';
import { MobileAuthController } from './controller/mobile-auth.controller';
import { MobileAuthService } from './service/mobile-auth.service';

@Module({
  imports: [
    forwardRef(() => LoginTransactionsModule),
    forwardRef(() => PublicKeysModule),
  ],
  providers: [MobileAuthService],
  controllers: [MobileAuthController],
})
export class MobileAuthModule {}
