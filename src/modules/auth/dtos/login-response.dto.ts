import { ApiProperty } from '@nestjs/swagger';
import { SanitizedUserDto } from './sanitized-user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for authenticated requests',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access tokens',
    example: '123e4567-e89b-12d3-a456-426614174000-abc123def456',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Sanitized user information',
    type: SanitizedUserDto,
  })
  user: SanitizedUserDto;
}

