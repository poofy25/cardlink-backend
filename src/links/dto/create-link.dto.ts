import {
  IsString,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { LinkKind } from '../../entities/link.entity';

export class CreateLinkDto {
  @ApiProperty({
    example: 'My Portfolio',
    description: 'Title/name of the link',
    maxLength: 160,
  })
  @IsString()
  @MaxLength(160)
  title!: string;

  @ApiProperty({
    example: 'https://myportfolio.com',
    description: 'URL the link points to',
    maxLength: 1024,
  })
  @IsUrl({}, { message: 'url must be a valid URL' })
  @MaxLength(1024)
  url!: string;

  @ApiProperty({
    example: 0,
    description: 'Order index for sorting links',
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  orderIndex?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the link is active/visible',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'custom',
    description: 'Type of link',
    enum: ['custom', 'social', 'email', 'phone', 'address', 'map'],
    default: 'custom',
  })
  @IsOptional()
  @IsEnum(['custom', 'social', 'email', 'phone', 'address', 'map'])
  kind?: LinkKind;

  @ApiProperty({
    example: 'github',
    description: 'Icon key for the link',
    maxLength: 64,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  iconKey?: string;

  @ApiProperty({
    example: { color: '#3B82F6', description: 'GitHub profile' },
    description: 'Additional metadata for the link',
    required: false,
  })
  @IsOptional()
  meta?: Record<string, unknown>;
}
