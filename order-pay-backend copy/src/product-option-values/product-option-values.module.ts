import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionValue } from './product-option-values.entity';
import { ProductOptionValuesService } from './product-option-values.service';
import { ProductOptionValuesController } from './product-option-values.controller';
import { ProductOption } from 'src/product-options/product-options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionValue]), TypeOrmModule.forFeature([ProductOption])],
  providers: [ProductOptionValuesService],
  controllers: [ProductOptionValuesController],
  exports: [ProductOptionValuesService],
})
export class ProductOptionValuesModule {}
