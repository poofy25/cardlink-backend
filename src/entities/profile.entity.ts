import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Link } from './link.entity';
import { MediaAsset } from './media-asset.entity';

export type LayoutMode = 'full_row_buttons' | 'icon_grid' | 'mixed';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.profiles, { onDelete: 'CASCADE' })
  owner!: User;

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

  @OneToMany(() => Link, (link) => link.profile)
  links!: Link[];

  @OneToMany(() => MediaAsset, (asset) => asset.profile)
  mediaAssets!: MediaAsset[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
