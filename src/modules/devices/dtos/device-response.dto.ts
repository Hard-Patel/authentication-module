import { ApiProperty } from '@nestjs/swagger';

export class DeviceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  platform: string;

  @ApiProperty({ nullable: true })
  pushToken?: string | null;

  @ApiProperty({ nullable: true })
  deviceModel?: string | null;

  @ApiProperty({ nullable: true })
  osVersion?: string | null;

  @ApiProperty({ nullable: true })
  appVersion?: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  lastSeenAt?: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
