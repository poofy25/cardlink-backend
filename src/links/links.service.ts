import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkValidatorService } from 'src/common/link-validator.service';
import { BaseLinkDto } from './dto/base-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly linkValidatorService: LinkValidatorService,
  ) {}

  async create({ id, dto }: { id: string; dto: BaseLinkDto }): Promise<Link> {
    try {
      // Process the link using the validator service
      const processedLink =
        this.linkValidatorService.processLink(dto).processedLink;

      const link = this.linksRepository.create({
        cardLink: { id },
        ...dto,
        title: processedLink.title,
        url: processedLink.url,
        isIncomplete: processedLink.isIncomplete,
        meta: processedLink.meta, // Include the processed meta with rawInput
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

      // // Update with processed values (excluding type and url)
      // link.title = processedLink.title;
      // link.isIncomplete = processedLink.isIncomplete;
      // link.meta = processedLink.meta || null; // Include the processed meta with rawInput

      Object.assign(link, processedLink);

      return this.linksRepository.save(link);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update link');
    }
  }
}
