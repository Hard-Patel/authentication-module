import { ApiProperty } from '@nestjs/swagger';

export class SanitizedUserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'User roles',
    example: ['user', 'admin'],
    type: [String],
  })
  roles: string[];

  @ApiProperty({
    description: 'Whether the user account is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Timestamp when email was verified',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  emailVerifiedAt: Date | null;

  @ApiProperty({
    description: 'Timestamp when user was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when user was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

