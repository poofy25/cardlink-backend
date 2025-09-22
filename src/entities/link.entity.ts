import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { LinkClick } from './link-click.entity';

export type LinkKind =
  | 'custom'
  | 'social'
  | 'email'
  | 'phone'
  | 'address'
  | 'map';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profile, (profile) => profile.links, { onDelete: 'CASCADE' })
  profile!: Profile;

  @Column({ type: 'varchar', length: 160 })
  title!: string;

  @Column({ type: 'varchar', length: 1024 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  orderIndex!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 32, default: 'custom' })
  kind!: LinkKind;

  @Column({ type: 'varchar', length: 64, nullable: true })
  iconKey!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  meta!: Record<string, unknown> | null;

  @Column({ type: 'int', default: 0 })
  clickCount!: number;

  @OneToMany(() => LinkClick, (click) => click.link)
  clicks!: LinkClick[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
