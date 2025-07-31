import { IsString, IsOptional, IsNumber } from 'class-validator';

export class JoinTableDto {
  @IsString()
  qrToken: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  guestId?: string;
}