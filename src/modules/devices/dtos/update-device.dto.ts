import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeviceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pushToken?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceModel?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  osVersion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appVersion?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'If true, update lastSeenAt to now' })
  @IsOptional()
  @IsBoolean()
  touchLastSeen?: boolean;
}
