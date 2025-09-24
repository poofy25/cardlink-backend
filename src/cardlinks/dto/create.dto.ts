import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateLinkDto } from '../../links/dto/create-link.dto';

export class CreateCardLinkDto {
  @ApiProperty({ example: 'john-doe' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'I am a software engineer' })
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  jobTitle?: string;

  @ApiProperty({ example: 'Google' })
  @IsString()
  company?: string;

  @ApiProperty({ example: 'https://www.example.com' })
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    example: [
      {
        title: 'My Portfolio',
        url: 'https://myportfolio.com',
        kind: 'custom',
        iconKey: 'portfolio',
        orderIndex: 0,
        isActive: true,
      },
      {
        title: 'GitHub',
        url: 'https://github.com/username',
        kind: 'social',
        iconKey: 'github',
        orderIndex: 1,
        isActive: true,
      },
    ],
    description: 'Array of links to be created with the card link',
    type: [CreateLinkDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links?: CreateLinkDto[];
}
