import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardLink } from 'src/entities/card-link.entity';
import { Repository } from 'typeorm';
import { CreateCardLinkDto } from './dto/create.dto';
import { UpdateCardLinkDto } from './dto/update.dto';

@Injectable()
export class CardLinksService {
  constructor(
    @InjectRepository(CardLink)
    private readonly cardLinkRepository: Repository<CardLink>,
  ) {}

  async getAll(userId: string): Promise<CardLink[]> {
    try {
      return this.cardLinkRepository.find({
        where: {
          owner: {
            id: userId,
          },
        },
      });
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get card links');
    }
  }

  async create(userId: string, dto: CreateCardLinkDto): Promise<CardLink> {
    try {
      const cardLink = this.cardLinkRepository.create({
        owner: {
          id: userId,
        },
        ...dto,
      });

      return this.cardLinkRepository.save(cardLink);
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

      this.cardLinkRepository.merge(cardLink, dto);

      return this.cardLinkRepository.save(cardLink);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update card link');
    }
  }
}
