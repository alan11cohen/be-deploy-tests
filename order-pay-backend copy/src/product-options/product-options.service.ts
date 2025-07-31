import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOption } from './product-options.entity';
import { Product } from 'src/products/product.entity';

@Injectable()
export class ProductOptionsService {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionsRepository: Repository<ProductOption>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<ProductOption[]> {
    return this.productOptionsRepository.find();
  }

  async findOne(id: number): Promise<ProductOption> {
    const productOption = await this.productOptionsRepository.findOneBy({ id });
    if (!productOption) {
      throw new NotFoundException(`ProductOption with id ${id} not found`);
    }
    return productOption;
  }

  async create(data: Partial<ProductOption>): Promise<ProductOption> {
    const product = await this.productRepository.findOneBy({ id: data.productId });
    if (!product) throw new NotFoundException(`Product with id ${data.productId} not found`);

    data.product = product;

    const productOption = this.productOptionsRepository.create(data);
    return this.productOptionsRepository.save(productOption);
  }

  async update(id: number, data: Partial<ProductOption>): Promise<ProductOption> {
    await this.productOptionsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.productOptionsRepository.delete(id);
  }
}
