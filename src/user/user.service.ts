import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.userRepository.findOne({ where: { email } });
    return found ?? null;
  }

  async createUser(params: {
    email: string;
    passwordHash: string;
    displayName: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      email: params.email,
      passwordHash: params.passwordHash,
      displayName: params.displayName,
      onboardingState: 'none',
    });
    return this.userRepository.save(user);
  }
}
