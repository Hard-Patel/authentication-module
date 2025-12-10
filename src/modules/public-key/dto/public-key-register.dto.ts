import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class RegisterPublicKeyDto {
  @ApiPropertyOptional({
    description: 'Optional key id (kid). If omitted, server generates one.',
  })
  @IsOptional()
  @IsString()
  keyId?: string | null;

  @ApiProperty({
    description: 'Public key material (PEM or compact JWK JSON string)',
  })
  @IsString()
  @IsNotEmpty()
  publicKey: string;

  @ApiProperty({ example: 'ES256' })
  @IsString()
  algorithm: string;

  @ApiPropertyOptional({
    description: 'Optional JSON metadata (attestation, certs, etc.)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;
}
