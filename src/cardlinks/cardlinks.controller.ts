import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CardLinksService } from './cardlinks.service';
import type { AuthenticatedRequest } from 'src/types/request.types';
import { CardLink } from 'src/entities/card-link.entity';
import { CreateCardLinkDto } from './dto/create.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateCardLinkDto } from './dto/update.dto';
import type { UsernameValidationResponse } from './types/cardlinks.types';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('cardlinks')
@Controller('cardlinks')
export class CardLinksController {
  constructor(private readonly cardLinksService: CardLinksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cardlinks' })
  @ApiOkResponse({ description: 'All cardlinks', type: [CardLink] })
  async getAll(@Req() req: AuthenticatedRequest): Promise<CardLink[]> {
    return this.cardLinksService.getAll(req.user.id);
  }

  @Get('validate-username')
  @ApiOperation({ summary: 'Validate username' })
  @ApiQuery({ name: 'username', description: 'Username to validate' })
  @ApiOkResponse({
    description: 'Username validation',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean' },
        suggestions: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async validateUsername(
    @Query('username') username: string,
  ): Promise<UsernameValidationResponse> {
    return this.cardLinksService.validateUsername(username);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cardlink by id' })
  @ApiOkResponse({ description: 'Cardlink', type: CardLink })
  async getByIdOrSlug(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<CardLink> {
    return this.cardLinksService.getById(req.user.id, id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a cardlink by slug' })
  @ApiOkResponse({ description: 'Cardlink', type: CardLink })
  async getBySlug(@Param('slug') slug: string): Promise<CardLink> {
    return this.cardLinksService.getBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cardlink' })
  @ApiBody({ type: CreateCardLinkDto })
  @ApiOkResponse({ description: 'New cardlink', type: CardLink })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCardLinkDto,
  ): Promise<CardLink> {
    return this.cardLinksService.create(req.user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cardlink' })
  @ApiBody({ type: UpdateCardLinkDto })
  @ApiOkResponse({ description: 'Updated cardlink', type: CardLink })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCardLinkDto,
  ): Promise<CardLink> {
    return this.cardLinksService.update(req.user.id, id, dto);
  }
}
