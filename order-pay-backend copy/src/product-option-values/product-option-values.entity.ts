import { ProductOption } from 'src/product-options/product-options.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column('int')
  limit: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => ProductOption, productOption => productOption.productOptionValues)
  productOption: ProductOption;

  productOptionId? : number
}