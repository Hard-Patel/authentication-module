import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token obtained from login or previous refresh',
    example: '123e4567-e89b-12d3-a456-426614174000-abc123def456',
  })
  @IsString()
  refreshToken: string;
}

