import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CardLink } from './card-link.entity';
import { LinkClick } from './link-click.entity';

@Entity({ name: 'links' })
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Link belongs to a CardLink
  @ManyToOne(() => CardLink, (card) => card.links, { onDelete: 'CASCADE' })
  cardLink!: CardLink;

  // Display label / title
  @Column({ type: 'varchar', length: 160, nullable: true })
  title!: string;

  // Default clickable URL (optional for map/address)
  @Column({ type: 'varchar', length: 1024, nullable: true })
  url!: string | null;

  // Sorting order
  @Column({ type: 'int', default: 0 })
  orderIndex!: number;

  // Visibility toggle
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Whether the link has all required data to be complete
  @Column({ type: 'boolean', default: true })
  isIncomplete!: boolean;

  // Type of type (e.g., "instagram", "email", "map")
  @Column({ type: 'varchar', length: 64 })
  type!: string;

  // Flexible JSON field for type-specific data
  // Examples: { username, phone, email, lat, lng, street, city, country }
  @Column({ type: 'jsonb', nullable: true })
  meta!: Record<string, unknown> | null;

  // Click tracking
  @Column({ type: 'int', default: 0 })
  clickCount!: number;

  @OneToMany(() => LinkClick, (click) => click.link)
  clicks!: LinkClick[];

  // Timestamps
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
