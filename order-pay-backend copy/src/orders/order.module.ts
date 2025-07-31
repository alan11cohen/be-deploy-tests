import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { Table } from '../tables/table.entity';
import { Product } from '../products/product.entity';
import { OrderProductDetails } from './order-product-details.entity';
import { OrderProductOption } from './order-product-option.entity';
import { ProductOption } from 'src/product-options/product-options.entity';
import { ProductOptionValue } from 'src/product-option-values/product-option-values.entity';
import { TableSession } from 'src/table-sessions/table-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Table, TableSession, Product, OrderProductDetails, OrderProductOption, ProductOption, ProductOptionValue])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
