import { Controller, Body, Req, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { SetActiveCardLinkDto } from './dto/set-active-card-link.dto';
import * as requestTypes from 'src/types/request.types';
import { ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CardLink } from 'src/entities/card-link.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Put('set-active-card-link')
  @ApiOperation({ summary: 'Set the active card link for an account' })
  @ApiBody({ type: SetActiveCardLinkDto })
  @ApiOkResponse({ description: 'Active card link set', type: CardLink })
  async setActiveCardLink(
    @Body() dto: SetActiveCardLinkDto,
    @Req() req: requestTypes.AuthenticatedRequest,
  ) {
    return this.accountsService.setActiveCardLink(req.user.id, dto.cardLinkId);
  }
}
