import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkClick } from 'src/entities/link-click.entity';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkClick])],
  providers: [LinksService],
  controllers: [LinksController],
  exports: [TypeOrmModule],
})
export class LinksModule {}
