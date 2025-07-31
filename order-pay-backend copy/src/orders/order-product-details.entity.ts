import { Product } from 'src/products/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { OrderProductOption } from './order-product-option.entity';

@Entity()
export class OrderProductDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @OneToMany(() => OrderProductOption, (opo) => opo.orderProduct, {
    cascade: true,
    eager: true,
  })
  selectedOptions: OrderProductOption[];
}
