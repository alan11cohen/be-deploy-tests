import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, Equal } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { deletedSince: IsNull() },
      relations: {
        productOptions: {
          productOptionValues: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productRepository.findOne({ 
      where: { id, deletedSince:IsNull() },
      relations: {
        productOptions: {
          productOptionValues: true,
        },
      },
    });
  }

  async findByRestaurant(restaurantId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        restaurant: { id: Equal(restaurantId) },
        deletedSince: IsNull(),
      },
      relations: {
        productOptions: {
          productOptionValues: true,
        },
      },
      order: { name: 'ASC' }, // TODO: Agregar mejores criterios de orden
    });
  }

  async create(productData: { name: string; price: number; hide: boolean; restaurantId: number, imageUrl: string, description: string, isVegan?: boolean, acceptsNotes?: boolean, glutenFree?: boolean }): Promise<Product> {
    const restaurant = await this.restaurantRepository.findOneBy({ id: productData.restaurantId });
    if (!restaurant) throw new NotFoundException(`Restaurant with id ${productData.restaurantId} not found`);

    const product = this.productRepository.create({
      name: productData.name,
      price: productData.price,
      hide: productData.hide,
      restaurant,
      imageUrl: productData.imageUrl,
      description: productData.description,
      isVegan: productData.isVegan || false,
      glutenFree: productData.glutenFree || false,
      acceptsNotes: productData.acceptsNotes || true
    });
    return this.productRepository.save(product);
  }

  async update(id: number, productData: Partial<{ name: string; price: number; hide: boolean }>): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id, deletedSince: IsNull() });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async softDelete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id, deletedSince: IsNull() });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);

    product.deletedSince = new Date();
    await this.productRepository.save(product);
  }
}
