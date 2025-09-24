import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Link } from './link.entity';
import { MediaAsset } from './media-asset.entity';
import { Account } from './account.entity';

export type LayoutMode = 'full_row_buttons' | 'icon_grid' | 'mixed';

@Entity({ name: 'cardlinks' })
export class CardLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Account, (account: Account) => account.cardLinks, {
    onDelete: 'CASCADE',
  })
  owner!: Account;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  slug!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 280, nullable: true })
  bio!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatarUrl!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  theme!: Record<string, unknown> | null;

  @Column({ type: 'boolean', default: true })
  isPublic!: boolean;

  @Column({ type: 'varchar', length: 32, default: 'full_row_buttons' })
  layoutMode!: LayoutMode;

  @OneToMany(() => Link, (link) => link.cardLink, { cascade: true })
  links: Link[];

  @OneToMany(
    () => MediaAsset,
    (asset: MediaAsset): CardLink => asset.cardLink,
    {
      cascade: true,
    },
  )
  mediaAssets!: Array<MediaAsset>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
