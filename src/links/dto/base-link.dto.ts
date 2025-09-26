import {
  IsString,
  IsOptional,
  MaxLength,
  Min,
  IsEnum,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateLinkMeta } from '../decorators/validate-link-meta.decorator';
import { LinkTypes } from 'src/configs/links/link-schemas';

export abstract class BaseLinkDto {
  @ApiProperty({
    example: 'My Portfolio',
    description: 'Title/name of the link',
    maxLength: 160,
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  title?: string;

  @ApiProperty({
    example: 0,
    description: 'Order index for sorting links',
    minimum: 0,
  })
  @IsOptional()
  @Min(0)
  orderIndex?: number;

  @ApiProperty({
    example: 'custom-link',
    description: 'Type of link',
    enum: LinkTypes,
    default: 'custom-link',
  })
  @IsNotEmpty()
  @IsEnum(LinkTypes)
  type: LinkTypes;

  @ApiProperty({
    example: true,
    description: 'Whether the link is active/visible',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: { color: '#3B82F6', description: 'GitHub profile' },
    description: 'Additional metadata for the link',
    required: false,
  })
  @IsOptional()
  // THIS DECORATOR MIGHT NOT EVEN WORK
  @ValidateLinkMeta()
  meta?: Record<string, unknown>;
}
