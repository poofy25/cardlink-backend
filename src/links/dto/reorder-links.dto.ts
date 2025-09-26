import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// This is a DTO for reordering links for a cardlink
export class ReorderLinksDto {
  @ApiProperty({
    example: ['link1', 'link2', 'link3'],
    description: 'Array of link ids in the new order',
  })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
