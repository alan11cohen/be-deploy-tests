import { IsNumber, IsString, IsOptional } from 'class-validator';

export class MercadopagoPaymentDto {
  @IsNumber()
  sessionId: number;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  successUrl?: string;

  @IsString()
  @IsOptional()
  failureUrl?: string;

  @IsString()
  @IsOptional()
  pendingUrl?: string;
}
