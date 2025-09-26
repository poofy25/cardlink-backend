import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkClick } from 'src/entities/link-click.entity';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkClick]), CommonModule],
  providers: [LinksService],
  controllers: [LinksController],
  exports: [TypeOrmModule],
})
export class LinksModule {}
