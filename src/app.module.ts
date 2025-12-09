import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/client.module';

@Module({
  imports: [DatabaseModule, AuthModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
