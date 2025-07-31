import { User } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderProductDetails } from './order-product-details.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import { TableSession } from 'src/table-sessions/table-session.entity';
import { OrderStatus } from './order-status';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TableSession, (TableSession) => TableSession.orders)
  tableSession: TableSession;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @OneToMany(() => OrderProductDetails, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderProductDetails[];

  @Column()
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;
}
