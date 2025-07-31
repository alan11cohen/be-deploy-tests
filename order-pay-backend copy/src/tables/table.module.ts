import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { Table } from './table.entity';
import { User } from '../users/user.entity';
import { FirebaseAdminModule } from '../firebase/firebase-admin.module';
import { Order } from 'src/orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Table, User, Order]),
    FirebaseAdminModule,
  ],
  providers: [TableService],
  controllers: [TableController],
})
export class TableModule {}
