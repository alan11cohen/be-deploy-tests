import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.findOne(id);
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  @Post()
  async create(@Body() productData: { name: string; price: number; hide: boolean; restaurantId: number, imageUrl: string, description: string, isVegan?: boolean, glutenFree?: boolean, acceptsNotes?: boolean }): Promise<Product> {
    return this.productService.create(productData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() productData: Partial<{ name: string; price: number; hide: boolean }>): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.productService.softDelete(id);
  }
}
