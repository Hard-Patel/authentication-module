import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class InitLoginDto {
  @ApiProperty({ description: 'external user id (client side user id)' })
  @IsString()
  @IsNotEmpty()
  externalUserId: string;

  @ApiPropertyOptional({
    description: 'optional pre-known authUserId to speed mapping',
  })
  @IsOptional()
  @IsString()
  authUserId?: string | null;

  @ApiPropertyOptional({
    description: 'TTL seconds for the challenge (default 60s)',
  })
  @IsOptional()
  @IsInt()
  @Min(10)
  ttlSeconds?: number;
}
