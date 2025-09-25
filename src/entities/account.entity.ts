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
import { CardLink } from './card-link.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 120 })
  displayName!: string;

  @Column({ type: 'varchar', length: 32, default: 'none' })
  onboardingState!: string;

  @OneToMany(() => CardLink, (cardLink) => cardLink.owner, { cascade: true })
  cardLinks!: CardLink[];

  @ManyToOne(() => CardLink, (cardLink) => cardLink.owner, { 
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL'
  })
  activeCardLink!: CardLink | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
