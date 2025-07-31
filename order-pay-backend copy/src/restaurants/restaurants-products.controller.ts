import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.entity';
import { ProductService } from '../products/product.service';

@Controller('restaurants/:restaurantId/products')
export class RestaurantsProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getMenu(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.productService.findByRestaurant(restaurantId);
  }
}
