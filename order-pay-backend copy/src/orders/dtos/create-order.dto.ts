import { IsNumber, IsArray, ValidateNested, IsOptional, IsString, Min, isArray } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderProductOptionsDto {
  @IsNumber()
  productOptionId: number;

  @IsArray()
  productOptionValues: number[];
}

export class OrderProductDto {
  @IsNumber()
  productId: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderProductOptionsDto)
  productOptions?: OrderProductOptionsDto[];

  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateOrderDto {
  @IsNumber()
  tableId: number;

  @IsNumber()
  restaurantId: number;

  @IsNumber()
  tableSessionId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}