import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardLink } from 'src/entities/card-link.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCardLinkDto } from './dto/create.dto';
import { UpdateCardLinkDto } from './dto/update.dto';
import type { UsernameValidationResponse } from './types/cardlinks.types';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/entities/account.entity';

@Injectable()
export class CardLinksService {
  constructor(
    @InjectRepository(CardLink)
    private readonly cardLinkRepository: Repository<CardLink>,
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
  ) {}

  async getAll(userId: string): Promise<CardLink[]> {
    try {
      return this.cardLinkRepository.find({
        where: {
          owner: {
            id: userId,
          },
        },
        relations: {
          links: true,
        },
      });
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get card links');
    }
  }

  async getById(userId: string, id: string): Promise<CardLink> {
    try {
      const cardLink = await this.cardLinkRepository.findOne({
        relations: {
          links: true,
        },
        where: {
          owner: { id: userId },
          id: id,
        },
      });

      if (!cardLink) {
        throw new NotFoundException('Card link not found');
      }
      return cardLink;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get card link');
    }
  }

  async getBySlug(slug: string): Promise<CardLink> {
    try {
      const cardLink = await this.cardLinkRepository.findOne({
        relations: {
          links: true,
        },
        where: {
          slug: slug,
          isPublic: true,
        },
      });

      if (!cardLink) {
        throw new NotFoundException('Card link not found');
      }
      return cardLink;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get card link');
    }
  }

  async create(userId: string, dto: CreateCardLinkDto): Promise<CardLink> {
    try {
      return this.dataSource.transaction(async (manager) => {
        const cardLink = manager.create(CardLink, {
          ...dto,
          owner: {
            id: userId,
          },
          links: dto.links,
        });
        // Save it within the transaction
        const savedCardLink = await manager.save(cardLink);

        // Set active card link safely within the transaction
        await manager.update(
          Account,
          { id: userId },
          { activeCardLink: { id: savedCardLink.id } },
        );

        return savedCardLink;
      });
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create card link');
    }
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateCardLinkDto,
  ): Promise<CardLink> {
    try {
      const cardLink = await this.cardLinkRepository.findOne({
        where: {
          owner: { id: userId },
          id: id,
        },
      });

      if (!cardLink) {
        throw new NotFoundException('Card link not found');
      }

      // Merge only the provided fields from DTO into the existing entity
      // This ensures only the fields provided in the request body are updated
      this.cardLinkRepository.merge(cardLink, dto);

      return this.cardLinkRepository.save(cardLink);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update card link');
    }
  }

  async validateUsername(
    username: string,
  ): Promise<UsernameValidationResponse> {
    try {
      const cardLink = await this.cardLinkRepository.findOne({
        where: { slug: username },
      });

      if (!cardLink) {
        return { available: true, suggestions: [] };
      }

      // Generate suggestions for taken username
      const suggestions = await this.generateUsernameSuggestions(username);

      return { available: false, suggestions };
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to validate username');
    }
  }

  private async generateUsernameSuggestions(
    baseUsername: string,
  ): Promise<string[]> {
    const suggestions: string[] = [];
    const maxAttempts = 10;

    // Strategy 1: Add numbers (1-999)
    for (let i = 1; i <= 999 && suggestions.length < 3; i++) {
      const suggestion = `${baseUsername}${i}`;
      const exists = await this.cardLinkRepository.findOne({
        where: { slug: suggestion },
      });
      if (!exists) {
        suggestions.push(suggestion);
      }
    }

    // Strategy 2: Add random numbers if we still need more suggestions
    if (suggestions.length < 3) {
      for (let i = 0; i < maxAttempts && suggestions.length < 3; i++) {
        const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        const suggestion = `${baseUsername}${randomNum}`;
        const exists = await this.cardLinkRepository.findOne({
          where: { slug: suggestion },
        });
        if (!exists && !suggestions.includes(suggestion)) {
          suggestions.push(suggestion);
        }
      }
    }

    // Strategy 3: Add common suffixes if still needed
    const suffixes = ['_', '-', 'official', 'real', 'new'];
    for (const suffix of suffixes) {
      if (suggestions.length >= 3) break;

      const suggestion = `${baseUsername}${suffix}`;
      const exists = await this.cardLinkRepository.findOne({
        where: { slug: suggestion },
      });
      if (!exists && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  }
}
