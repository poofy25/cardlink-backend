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

@Injectable()
export class CardLinksService {
  constructor(
    @InjectRepository(CardLink)
    private readonly cardLinkRepository: Repository<CardLink>,
    private readonly dataSource: DataSource,
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
        return manager.save(cardLink);
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

      this.cardLinkRepository.merge(cardLink, dto);

      return this.cardLinkRepository.save(cardLink);
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update card link');
    }
  }
}
