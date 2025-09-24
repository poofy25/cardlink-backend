import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardLink } from 'src/entities/card-link.entity';
import { CardLinksService } from './cardlinks.service';
import { CardLinksController } from './cardlinks.controller';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([CardLink]), AccountsModule],
  controllers: [CardLinksController],
  providers: [CardLinksService],
  exports: [TypeOrmModule],
})
export class CardLinksModule {}
