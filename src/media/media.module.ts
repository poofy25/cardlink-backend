import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAsset } from 'src/entities/media-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset])],
  providers: [],
  exports: [TypeOrmModule],
})
export class MediaModule {}
