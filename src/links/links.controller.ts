import { Body, Controller, Param, Post } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { Link } from 'src/entities/link.entity';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('cardlinks/:id/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({ type: CreateLinkDto })
  @ApiOkResponse({ description: 'New link', type: Link })
  async create(
    @Param('id') id: string,
    @Body() dto: CreateLinkDto,
  ): Promise<Link> {
    return this.linksService.create({ id, dto });
  }
}
