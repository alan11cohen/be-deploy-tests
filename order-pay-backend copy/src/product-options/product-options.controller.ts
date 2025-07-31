import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductOptionsService } from './product-options.service';
import { ProductOption } from './product-options.entity';

@Controller('product-options')
export class ProductOptionsController {
  constructor(private readonly productOptionsService: ProductOptionsService) {}

  @Get()
  getAll(): Promise<ProductOption[]> {
    return this.productOptionsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ProductOption> {
    return this.productOptionsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<ProductOption>): Promise<ProductOption> {
    return this.productOptionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<ProductOption>): Promise<ProductOption> {
    return this.productOptionsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productOptionsService.remove(+id);
  }
}
