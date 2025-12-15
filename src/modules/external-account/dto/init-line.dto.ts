import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InitExternalLinkDto {
  @ApiProperty({ description: 'Client-side user identifier' })
  @IsString()
  @IsNotEmpty()
  externalUserId: string;
}
