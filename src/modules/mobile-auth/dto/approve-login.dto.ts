import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveLoginDto {
  @IsString()
  @IsNotEmpty()
  keyId: string;

  @IsString()
  @IsNotEmpty()
  signature: string; // base64 / base64url
}
