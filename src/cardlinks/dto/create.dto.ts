import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardLinkDto {
  @ApiProperty({ example: 'john-doe' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'I am a software engineer' })
  @IsString()
  bio!: string;

  @ApiProperty({ example: 'https://www.example.com' })
  @IsString()
  avatarUrl!: string;
}
