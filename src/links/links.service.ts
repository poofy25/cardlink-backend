import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinkValidatorService } from 'src/common/link-validator.service';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
    private readonly linkValidatorService: LinkValidatorService,
  ) {}

  async create({ id, dto }: { id: string; dto: CreateLinkDto }): Promise<Link> {
    // Process the link using the validator service
    const processedLink = this.linkValidatorService.processLink(dto);

    const link = this.linksRepository.create({
      cardLink: { id },
      ...dto,
      title: processedLink.title,
      url: processedLink.url,
      isIncomplete: processedLink.isIncomplete,
      meta: processedLink.meta, // Include the processed meta with rawInput
    });
    return this.linksRepository.save(link);
  }

  async update(id: string, dto: Partial<CreateLinkDto>): Promise<Link> {
    const link = await this.linksRepository.findOne({ where: { id } });
    if (!link) {
      throw new Error('Link not found');
    }

    // Update the link with new data
    Object.assign(link, dto);

    // Process the updated link using the validator service
    const processedLink = this.linkValidatorService.processLink(link as CreateLinkDto);
    
    // Update with processed values
    link.title = processedLink.title;
    link.url = processedLink.url || null;
    link.isIncomplete = processedLink.isIncomplete;
    link.meta = processedLink.meta || null; // Include the processed meta with rawInput

    return this.linksRepository.save(link);
  }
}
