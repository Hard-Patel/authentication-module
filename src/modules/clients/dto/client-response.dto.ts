import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty({
    description: 'Internal UUID of the client',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Public client identifier (used by third-parties for authentication)',
    example: 'client_abc123xyz',
  })
  clientId: string;

  @ApiProperty({
    description: 'Client secret (only returned on creation, store securely)',
    example: 'secret_xyz789abc',
    required: false,
  })
  clientSecret?: string;

  @ApiProperty({
    description: 'Client display name',
    example: 'My Third-Party App',
  })
  name: string;

  @ApiProperty({
    description: 'Allowed redirect URIs for this client',
    type: [String],
    example: ['https://example.com/callback'],
  })
  redirectUris: string[];

  @ApiProperty({
    description: 'Is the client active?',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp (ISO)',
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Update timestamp (ISO)',
    type: String,
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
