import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardLink } from 'src/entities/card-link.entity';
import { CardLinksService } from './cardlinks.service';
import { CardLinksController } from './cardlinks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CardLink])],
  controllers: [CardLinksController],
  providers: [CardLinksService],
  exports: [TypeOrmModule],
})
export class CardLinksModule {}
