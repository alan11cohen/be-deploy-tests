import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restaurant } from '../restaurants/restaurant.entity';
import { TableSession } from 'src/table-sessions/table-session.entity';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  seats: number;

  @Column({ length: 500 })
  qrCode: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables)
  restaurant: Restaurant;

  @Column({ type: 'int', nullable: true })
  activeSessionId: number | null;

  @OneToMany(() => TableSession, (tableSession) => tableSession.table)
  tableSessions: TableSession[];

  @Column({ default: false })
  isBusy: Boolean;
}
