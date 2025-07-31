import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { ProductOption } from 'src/product-options/product-options.entity';
import { ProductOptionValue } from 'src/product-option-values/product-option-values.entity';
import { OrderProductDetails } from './order-product-details.entity';

@Entity()
export class OrderProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderProductDetails, (orderProduct) => orderProduct.selectedOptions, { onDelete: 'CASCADE' })
  orderProduct: OrderProductDetails;

  @ManyToOne(() => ProductOption, { eager: true })
  productOption: ProductOption;

  @ManyToMany(() => ProductOptionValue, { eager: true })
  @JoinTable()
  values: ProductOptionValue[];
}
