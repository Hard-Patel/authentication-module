import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/entities/user.entity';
import { RefreshToken } from '../modules/entities/refresh-token.entity';
import { Client } from '../modules/entities/client.entity';
import { Device } from '../modules/entities/device.entity';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      isProd
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, RefreshToken, Client, Device],
            synchronize: false,
            logging: false,
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            migrationsRun: false,
          }
        : {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: Number(process.env.DATABASE_PORT || 5432),
            username: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgres',
            database: process.env.DATABASE_NAME || 'auth_db',
            entities: [User, RefreshToken, Client, Device],
            synchronize: false,
            logging: process.env.NODE_ENV === 'development',
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            migrationsRun: false,
          },
    ),
  ],
})
export class DatabaseModule {}
