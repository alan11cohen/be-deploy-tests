import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { ProductOption } from 'src/product-options/product-options.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'datetime', nullable: true })
  deletedSince?: Date | null;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;
  
  @Column()
  hide: boolean;

  @Column('decimal')
  price: number;

  @Column({ default: true })
  acceptsNotes: boolean;

  @Column({ default: false })
  isVegan: boolean;

  @Column({ default: false })
  glutenFree: boolean;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @ManyToOne(() => Restaurant, restaurant => restaurant.products)
  restaurant: Restaurant;
  
  @OneToMany(() => ProductOption, (productOption) => productOption.product)
  productOptions: ProductOption[];
}