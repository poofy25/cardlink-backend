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

      if (!ids || ids.length !== 2) {
        throw new BadRequestException('Exactly two ids are required');
      }

      const cardLink = await this.cardLinksRepository.findOne({
        where: { id: cardLinkId, owner: { id: userId } },
        relations: ['links'],
      });

      if (!cardLink) {
        throw new NotFoundException('Card link not found');
      }

      const [idA, idB] = ids;
      const links = cardLink.links;
      const itemA = links.find((i) => i.id === idA);
      const itemB = links.find((i) => i.id === idB);

      if (!itemA || !itemB) {
        throw new BadRequestException('Invalid link ids');
      }

      // 🔄 swap their orderIndex values
      const tempOrder = itemA.orderIndex;
      itemA.orderIndex = itemB.orderIndex;
      itemB.orderIndex = tempOrder;

      await this.linksRepository.manager.transaction(async (manager) => {
        await manager.save([itemA, itemB]);
      });

      // Return all links for the cardlink, not just the swapped ones
      return this.linksRepository.find({
        where: { cardLink: { id: cardLinkId } },
        order: { orderIndex: 'ASC' },
      });
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException('Failed to reorder links');
    }
  }
}
