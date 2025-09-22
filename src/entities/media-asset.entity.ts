import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export type MediaKind = 'avatar' | 'banner';

@Entity({ name: 'media_assets' })
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profile, (profile) => profile.mediaAssets, {
    onDelete: 'CASCADE',
  })
  profile!: Profile;

  @Column({ type: 'varchar', length: 32 })
  kind!: MediaKind;

  @Column({ type: 'varchar', length: 512 })
  s3Key!: string;

  @Column({ type: 'varchar', length: 128 })
  contentType!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
