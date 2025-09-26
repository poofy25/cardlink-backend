import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkClick } from 'src/entities/link-click.entity';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { CommonModule } from 'src/common/common.module';
import { CardLink } from 'src/entities/card-link.entity';
import { LinkValidatorService } from 'src/common/link-validator.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkClick, CardLink]), CommonModule],
  providers: [LinksService, LinkValidatorService],
  controllers: [LinksController],
  exports: [TypeOrmModule],
})
export class LinksModule {}
