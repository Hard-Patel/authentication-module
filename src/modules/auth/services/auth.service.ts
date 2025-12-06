import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UsersService } from './users.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash' | 'refreshTokens'>;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash' | 'refreshTokens'>> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      roles: ['user'], // Default role
    });

    return this.sanitizeUser(user);
  }

  async login(loginDto: LoginDto, deviceInfo?: string): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(user, deviceInfo);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refresh(refreshTokenString: string, deviceInfo?: string): Promise<AuthResponse> {
    const tokenHash = this.hashRefreshToken(refreshTokenString);

    const refreshTokenRecord = await this.refreshTokenRepository.findOne({
      where: { tokenHash, isActive: true },
      relations: ['user'],
    });

    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (refreshTokenRecord.expiresAt && refreshTokenRecord.expiresAt < new Date()) {
      await this.refreshTokenRepository.remove(refreshTokenRecord);
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = refreshTokenRecord.user;
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Rotate tokens: remove old refresh token
    await this.refreshTokenRepository.remove(refreshTokenRecord);

    // Generate new token pair
    const tokens = await this.generateTokens(user, deviceInfo);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async logout(refreshTokenString: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshTokenString);

    const refreshTokenRecord = await this.refreshTokenRepository.findOne({
      where: { tokenHash, isActive: true },
    });

    if (refreshTokenRecord) {
      await this.refreshTokenRepository.remove(refreshTokenRecord);
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }
    return user;
  }

  private async generateTokens(
    user: User,
    deviceInfo?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = this.generateRefreshToken();
    const tokenHash = this.hashRefreshToken(refreshToken);

    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const expiresAt = this.calculateExpiryDate(expiresIn);

    await this.refreshTokenRepository.save({
      userId: user.id,
      tokenHash,
      expiresAt,
      isActive: true,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateRefreshToken(): string {
    const uuid = crypto.randomUUID();
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${uuid}-${randomBytes}`;
  }

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiryDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([dhm])$/);
    if (!match) {
      // Default to 7 days if format is invalid
      now.setDate(now.getDate() + 7);
      return now;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
    }

    return now;
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash' | 'refreshTokens'> {
    const { passwordHash, refreshTokens, ...sanitized } = user;
    return sanitized;
  }
}

