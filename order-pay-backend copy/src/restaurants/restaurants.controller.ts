import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './restaurant.entity';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  getAll(): Promise<Restaurant[]> {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Restaurant>): Promise<Restaurant> {
    return this.restaurantsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Restaurant>): Promise<Restaurant> {
    return this.restaurantsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.restaurantsService.remove(+id);
  }
}
