import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findByEmail(
    email: string,
    includePasswordHash = false,
  ): Promise<Account | null> {
    const found = await this.accountRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        displayName: true,
        onboardingState: true,
        createdAt: true,
        updatedAt: true,
        ...(includePasswordHash && { passwordHash: true }),
      },
      relations: {
        cardLinks: true,
      },
    });
    return found ?? null;
  }

  async createAccount(params: {
    email: string;
    passwordHash: string;
    displayName: string;
  }): Promise<Account> {
    try {
      const account = this.accountRepository.create({
        email: params.email,
        passwordHash: params.passwordHash,
        displayName: params.displayName,
        onboardingState: 'none',
      });
      return this.accountRepository.save(account);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create account');
    }
  }
}
