import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [TypeOrmModule, AccountsService],
})
export class AccountsModule {}
