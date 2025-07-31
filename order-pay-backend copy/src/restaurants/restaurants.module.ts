import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsProductsController } from './restaurants-products.controller';
import { ProductService } from '../products/product.service';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), TypeOrmModule.forFeature([Product])],
  providers: [RestaurantsService, ProductService],
  controllers: [RestaurantsController, RestaurantsProductsController],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
