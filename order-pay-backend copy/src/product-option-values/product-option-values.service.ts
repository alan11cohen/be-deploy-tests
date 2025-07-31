import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { ProductOptionValue } from './product-option-values.entity';
import { ProductOption } from 'src/product-options/product-options.entity';

@Injectable()
export class ProductOptionValuesService {
  constructor(
    @InjectRepository(ProductOptionValue)
    private productOptionValuesRepository: Repository<ProductOptionValue>,
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
  ) {}

  findAll(): Promise<ProductOptionValue[]> {
    return this.productOptionValuesRepository.find();
  }

  async findOne(id: number): Promise<ProductOptionValue> {
    const productOptionValue = await this.productOptionValuesRepository.findOneBy({ id });
    if (!productOptionValue) {
      throw new NotFoundException(`ProductOptionValue with id ${id} not found`);
    }
    return productOptionValue;
  }

  async create(data: Partial<ProductOptionValue>): Promise<ProductOptionValue> {
    const productOption = await this.productOptionRepository.findOneBy({ id: data.productOptionId });
    if (!productOption) throw new NotFoundException(`Product Option with id ${data.productOptionId} not found`);

    data.productOption = productOption;

    const productOptionValue = this.productOptionValuesRepository.create(data);
    return this.productOptionValuesRepository.save(productOptionValue);
  }

  async update(id: number, data: Partial<ProductOptionValue>): Promise<ProductOptionValue> {
    await this.productOptionValuesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productOptionValuesRepository.delete(id);
  }
}
