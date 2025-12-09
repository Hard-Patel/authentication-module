import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Display name for the client application',
    example: 'My Third-Party App',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Array of allowed redirect URIs for OAuth flows',
    type: [String],
    required: false,
    example: ['https://example.com/callback', 'https://example.com/oauth/callback'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUrl({}, { each: true })
  redirectUris?: string[] = [];
}
