import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Link } from './link.entity';
import { Profile } from './profile.entity';

@Entity({ name: 'link_clicks' })
export class LinkClick {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  profile!: Profile;

  @ManyToOne(() => Link, (link) => link.clicks, { onDelete: 'CASCADE' })
  link!: Link;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  occurredAt!: Date;

  @Column({ type: 'varchar', length: 128, nullable: true })
  userAgentHash!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ipHash!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  ref!: string | null;
}
