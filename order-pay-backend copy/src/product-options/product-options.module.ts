import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { ProductOption } from './product-options.entity';
import { ProductOptionsService } from './product-options.service';
import { ProductOptionsController } from './product-options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOption]), TypeOrmModule.forFeature([Product])],
  providers: [ProductOptionsService],
  controllers: [ProductOptionsController],
  exports: [ProductOptionsService],
})
export class ProductOptionsModule {}
