import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { LinksService } from './links.service';
import { BaseLinkDto } from './dto/base-link.dto';
import { Link } from 'src/entities/link.entity';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('cardlinks/:id/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBody({ type: BaseLinkDto })
  @ApiOkResponse({ description: 'New link', type: Link })
  async create(
    @Param('id') id: string,
    @Body() dto: BaseLinkDto,
  ): Promise<Link> {
    return this.linksService.create({ id, dto });
  }

  @Put(':linkId')
  @ApiOperation({ summary: 'Update a link' })
  @ApiBody({ type: BaseLinkDto })
  @ApiOkResponse({ description: 'Updated link', type: Link })
  async update(
    @Param('id') cardLinkId: string,
    @Param('linkId') linkId: string,
    @Body() dto: Partial<BaseLinkDto>,
  ): Promise<Link> {
    return this.linksService.update(cardLinkId, linkId, dto);
  }
}
