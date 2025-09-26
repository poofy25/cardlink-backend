import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkValidatorService } from 'src/common/link-validator.service';
import { BaseLinkDto } from './dto/base-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { CardLink } from 'src/entities/card-link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly linkValidatorService: LinkValidatorService,
    @InjectRepository(CardLink)
    private readonly cardLinksRepository: Repository<CardLink>,
  ) {}

  async create({ id, dto }: { id: string; dto: BaseLinkDto }): Promise<Link> {
    try {
      // Process the link using the validator service
      const processedLink =
        this.linkValidatorService.processLink(dto).processedLink;

      const orderIndex = await this.linksRepository.count({
        where: { cardLink: { id } },
      });

      const link = this.linksRepository.create({
        cardLink: { id },
        ...dto,
        title: processedLink.title,
        url: processedLink.url,
        isIncomplete: processedLink.isIncomplete,
        meta: processedLink.meta, // Include the processed meta with rawInput
        orderIndex,
      });
      return this.linksRepository.save(link);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create link');
    }
  }

  async update(
    cardLinkId: string,
    id: string,
    dto: Partial<BaseLinkDto>,
  ): Promise<Link> {
    try {
      const link = await this.linksRepository.findOne({
        where: { id, cardLink: { id: cardLinkId } },
      });
      if (!link) {
        throw new Error('Link not found');
      }

      // Extract fields that should not be updated
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { type, ...updatableFields } = dto;

      // Update only the allowed fields
      Object.assign(link, updatableFields);

      // Process the updated link using the validator service
      // This will bit us in the ass later, we should not be using the link object as the dto
      const processedLink = this.linkValidatorService.processLink(
        link as unknown as BaseLinkDto,
      ).processedLink;

      Object.assign(link, processedLink);

      return this.linksRepository.save(link);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update link');
    }
  }

  async reorderLinks(
    cardLinkId: string,
    dto: ReorderLinksDto,
    userId: string,
  ): Promise<Link[]> {
    try {
      const { ids } = dto;

      if (!ids || ids.length === 0) {
        throw new BadRequestException('At least one id is required');
      }

      const cardLink = await this.cardLinksRepository.findOne({
        where: { id: cardLinkId, owner: { id: userId } },
        relations: ['links'],
      });

      if (!cardLink) {
        throw new NotFoundException('Card link not found');
      }

      // Get all links for this cardLink
      const allLinks = cardLink.links;
      
      // Validate that all provided IDs exist in the cardLink's links
      const providedLinks = ids.map(id => allLinks.find(link => link.id === id));
      if (providedLinks.some(link => !link)) {
        throw new BadRequestException('Invalid link ids provided');
      }

      // Update orderIndex for each link based on its position in the ids array
      providedLinks.forEach((link, index) => {
        if (link) {
          link.orderIndex = index;
        }
      });

      await this.linksRepository.manager.transaction(async (manager) => {
        await manager.save(providedLinks);
      });

      // Return all links for the cardlink in the new order
      return this.linksRepository.find({
        where: { cardLink: { id: cardLinkId } },
        order: { orderIndex: 'ASC' },
      });
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to reorder links');
    }
  }

  async deleteLink(
    cardLinkId: string,
    linkId: string,
    userId: string,
  ): Promise<{ deleted: boolean }> {
    try {
      const link = await this.linksRepository.findOne({
        where: {
          id: linkId,
          cardLink: { id: cardLinkId, owner: { id: userId } },
        },
      });

      if (!link) {
        throw new NotFoundException('Link not found');
      }

      await this.linksRepository.manager.transaction(async (manager) => {
        await manager.delete(Link, {
          id: linkId,
          cardLink: { id: cardLinkId, owner: { id: userId } },
        });

        const remainingLinks = await manager.find(Link, {
          where: { cardLink: { id: cardLinkId, owner: { id: userId } } },
          order: { orderIndex: 'ASC' },
        });

        remainingLinks.forEach((link, index) => {
          link.orderIndex = index;
        });

        await manager.save(remainingLinks);
      });

      return { deleted: true };
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete link');
    }
  }
}
