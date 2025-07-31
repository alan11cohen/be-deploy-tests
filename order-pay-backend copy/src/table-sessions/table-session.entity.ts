import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Table } from '../tables/table.entity';
import { Order } from 'src/orders/order.entity';
import { User } from '../users/user.entity';
import { Payment } from '../payments/payment.entity';

@Entity()
export class TableSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Table, (table) => table.tableSessions)
  table: Table;

  @Column()
  tableId: number;

  @Column({ type: 'decimal', default: 0 })
  total: number;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Order, (order) => order.tableSession)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.session)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  closedAt?: Date;
}
