import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableSession } from './table-session.entity';
import { TableSessionService } from './table-session.service';
import { TableSessionController } from './table-session.controller';
import { Table } from 'src/tables/table.entity';
import { TableService } from 'src/tables/table.service';
import { Order } from 'src/orders/order.entity';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, TableSession, Order, User])],
  providers: [TableSessionService, FirebaseAdminService, TableService],
  controllers: [TableSessionController],
})
export class TableSessionModule {}
