import { IsString, IsOptional, IsBoolean, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { LayoutMode } from '../../entities/card-link.entity';

export class UpdateCardLinkDto {
  @ApiProperty({ example: 'john-doe', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'I am a software engineer', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'Google', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'https://www.example.com', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ example: { primaryColor: '#000000' }, required: false })
  @IsOptional()
  @IsObject()
  theme?: Record<string, unknown>;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: 'full_row_buttons', required: false, enum: ['full_row_buttons', 'icon_grid', 'mixed'] })
  @IsOptional()
  @IsEnum(['full_row_buttons', 'icon_grid', 'mixed'])
  layoutMode?: LayoutMode;
}
