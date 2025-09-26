import { Module } from '@nestjs/common';
import { LinkValidatorService } from './link-validator.service';

@Module({
  imports: [],
  providers: [LinkValidatorService],
  exports: [LinkValidatorService],
})
export class CommonModule {}
