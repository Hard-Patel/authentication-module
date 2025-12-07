import { ApiProperty } from '@nestjs/swagger';
import { SanitizedUserDto } from './sanitized-user.dto';

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  accessToken: string;

  @ApiProperty({
    description: 'New refresh token (old one is rotated)',
    example: '123e4567-e89b-12d3-a456-426614174000-abc123def456',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Sanitized user information',
    type: SanitizedUserDto,
  })
  user: SanitizedUserDto;
}

