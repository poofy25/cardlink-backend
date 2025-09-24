import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from 'src/entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async create({ id, dto }: { id: string; dto: CreateLinkDto }): Promise<Link> {
    const link = this.linksRepository.create({
      cardLink: { id },
      ...dto,
    });
    return this.linksRepository.save(link);
  }
}
