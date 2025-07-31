import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType } from "./payment-types";
import { IsOptional } from "class-validator";
import { User } from "src/users/user.entity";
import { TableSession } from "src/table-sessions/table-session.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column('decimal')
  amount: number;

  @Column()
  currency: string;

  @Column()
  type: PaymentType;

  @CreateDateColumn()
  createdAt: Date;

  @IsOptional()
  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @IsOptional()
  @ManyToOne(() => TableSession, (session) => session.payments)
  session: TableSession;
}
