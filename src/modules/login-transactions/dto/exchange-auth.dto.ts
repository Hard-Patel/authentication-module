import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeAuthCodeDto {
  @ApiProperty({ description: 'Transaction id returned in init response' })
  @IsString()
  @IsNotEmpty()
  txId: string;

  @ApiProperty({
    description: 'One-time auth code the mobile flow returned after approval',
  })
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
