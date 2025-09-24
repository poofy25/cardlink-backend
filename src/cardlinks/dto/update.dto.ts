import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardLinkDto {
  @ApiProperty({ example: 'john-doe', required: false })
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  name?: string;

  @ApiProperty({ example: 'I am a software engineer', required: false })
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://www.example.com', required: false })
  @IsString()
  avatarUrl?: string;
}
