import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseLinkDto } from '../../links/dto/base-link.dto';

export class CreateCardLinkDto {
  @ApiProperty({ example: 'john-doe' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'I am a software engineer' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'Google' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'https://www.example.com' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: [
      {
        title: 'My Portfolio',
        type: 'custom-link',
        orderIndex: 0,
        isActive: true,
        meta: {
          rawInput: 'https://myportfolio.com',
          color: '#3B82F6',
          description: 'My personal portfolio website'
        }
      },
      {
        title: 'GitHub',
        type: 'custom-link',
        orderIndex: 1,
        isActive: true,
        meta: {
          rawInput: 'https://github.com/username',
          color: '#24292e',
          description: 'My GitHub profile'
        }
      },
    ],
    description: 'Array of links to be created with the card link',
    type: [BaseLinkDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseLinkDto)
  links?: BaseLinkDto[];
}
