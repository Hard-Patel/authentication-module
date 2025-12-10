import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RevokePublicKeyDto {
  @ApiProperty({ description: 'keyId to revoke (kid)' })
  @IsString()
  @IsNotEmpty()
  keyId: string;
}
