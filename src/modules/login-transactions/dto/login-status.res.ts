import { ApiProperty } from '@nestjs/swagger';

export class LoginStatusResponseDto {
  @ApiProperty()
  txId: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  expiresAt?: Date | null;

  @ApiProperty({ nullable: true })
  authUserId?: string | null;
}
