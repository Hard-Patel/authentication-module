import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/auth/entities/user.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'auth_db',
      entities: [User, RefreshToken],
      synchronize: false, // Always false in production - use migrations
      logging: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: false, // Set to true if you want migrations to run automatically on app start
    }),
  ],
})
export class DatabaseModule {}
