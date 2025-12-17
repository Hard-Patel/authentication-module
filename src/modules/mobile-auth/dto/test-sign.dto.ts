import { IsObject } from 'class-validator';

export class TestSignDto {
  @IsObject()
  payload: Record<string, any>;
}
