import { ApiProperty } from '@nestjs/swagger';

export class PublicKeyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  keyId?: string | null;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  algorithm: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  metadata?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
