import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/entities/link.entity';
import { LinkClick } from 'src/entities/link-click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, LinkClick])],
  providers: [],
  exports: [TypeOrmModule],
})
export class LinksModule {}
