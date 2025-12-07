import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByRefreshHash(refreshHash: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.refreshTokens', 'refreshToken')
      .where('refreshToken.tokenHash = :tokenHash', { tokenHash: refreshHash })
      .andWhere('refreshToken.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName?: string | null;
    lastName?: string | null;
    roles?: string[];
  }): Promise<User> {
    if (!userData.email) {
      throw new Error('Email is required to create a user');
    }

    const user = this.userRepository.create({
      email: userData.email,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      roles: userData.roles || [],
      isActive: true,
    });

    return this.userRepository.save(user);
  }

  async update(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }
}
