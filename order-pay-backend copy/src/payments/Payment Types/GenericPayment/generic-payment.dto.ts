import { IsNumber, IsString } from "class-validator";

export class GenericPaymentDto {

  @IsNumber()
  sessionId: number;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}