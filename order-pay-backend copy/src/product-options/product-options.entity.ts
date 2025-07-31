import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { ProductOptionValue } from 'src/product-option-values/product-option-values.entity';
import { ProductOptionType } from './product-options-type';

@Entity()
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ProductOptionType,
    default: ProductOptionType.SINGLE_CHOICE,
  })
  type: ProductOptionType;

  @Column('int')
  limit: number;
  
  @ManyToOne(() => Product, (product) => product.productOptions)
  product: Product;

  @OneToMany(() => ProductOptionValue, (value) => value.productOption)
  productOptionValues: ProductOptionValue[];

  productId? : number;
}