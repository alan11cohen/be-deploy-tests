import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductOptionValue } from './product-option-values.entity';
import { ProductOptionValuesService } from './product-option-values.service';

@Controller('product-option-values')
export class ProductOptionValuesController {
  constructor(private readonly productOptionValuesService: ProductOptionValuesService) {}

  @Get()
  getAll(): Promise<ProductOptionValue[]> {
    return this.productOptionValuesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ProductOptionValue> {
    return this.productOptionValuesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<ProductOptionValue>): Promise<ProductOptionValue> {
    return this.productOptionValuesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ProductOptionValue>): Promise<ProductOptionValue> {
    return this.productOptionValuesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productOptionValuesService.remove(+id);
  }
}
