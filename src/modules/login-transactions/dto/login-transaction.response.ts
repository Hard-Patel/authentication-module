import { ApiProperty } from '@nestjs/swagger';

export class LoginTransactionResponseDto {
  @ApiProperty()
  txId: string;

  @ApiProperty()
  challenge: string; // base64 challenge

  @ApiProperty()
  expiresAt: Date;
}
