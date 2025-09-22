import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardLink } from 'src/entities/card-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardLink])],
  providers: [],
  exports: [TypeOrmModule],
})
export class CardLinksModule {}
