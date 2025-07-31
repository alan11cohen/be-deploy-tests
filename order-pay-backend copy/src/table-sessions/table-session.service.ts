import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableSession } from 'src/table-sessions/table-session.entity';
import { IsNull, Repository } from 'typeorm';
import { Table } from '../tables/table.entity';
import { User } from '../users/user.entity';
import { JoinSessionDto } from './dtos/table-session-dto';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { Order } from 'src/orders/order.entity';
import { CreateSessionDTO } from './dtos/create-session-dto';
import { TableController } from 'src/tables/table.controller';
import { OrderStatus } from 'src/orders/order-status';
import { TableService } from 'src/tables/table.service';

@Injectable()
export class TableSessionService {
  constructor(
    // private readonly tableController: TableController,
    private readonly tableService: TableService,

    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(TableSession)
    private tableSessionRepository: Repository<TableSession>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private firebaseAdminService: FirebaseAdminService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async joinSessionByTableCode(
    qrCode: string,
    dto: JoinSessionDto,
  ): Promise<TableSession> {
    const table = await this.tableRepository.findOne({
      where: { qrCode },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    let session: TableSession | null = null;

    if (table.isBusy && table.activeSessionId) {
      session = await this.tableSessionRepository.findOne({
        where: { id: table.activeSessionId },
        relations: ['users', 'table'],
      });

      if (!session) {
        //TODO: falta integridad referencial entre mesa y sessionId activa
        table.isBusy = false;
        table.activeSessionId = null;
        await this.tableRepository.save(table);
      }
    }

    if (!table.isBusy || !session) {
      const newSession = this.tableSessionRepository.create({
        table,
        tableId: table.id,
        total: 0,
        users: [],
      });
      const savedSession = await this.tableSessionRepository.save(newSession);

      table.isBusy = true;
      table.activeSessionId = savedSession.id;
      await this.tableRepository.save(table);

      const reloadedSession = await this.tableSessionRepository.findOne({
        where: { id: savedSession.id },
        relations: ['users', 'table'],
      });

      if (!reloadedSession) {
        throw new NotFoundException('Session not found after creation');
      }

      session = reloadedSession;
    }

    if (!session) {
      throw new NotFoundException('Unable to create or find session');
    }

    return await this.addUserToSession(
      session.id,
      dto.userIdentifier,
      dto.userType,
    );
  }

  async addUserToSession(
    sessionId: number,
    userIdentifier: string,
    userType: 'guest' | 'logged',
  ): Promise<TableSession> {
    const session = await this.tableSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['users'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    let user: User;

    if (userType === 'logged') {
      try {
        const decodedToken = await this.firebaseAdminService.auth.verifyIdToken(
          userIdentifier,
        );

        let foundUser = await this.userRepository.findOne({
          where: {
            email: decodedToken.email,
          },
        });

        if (!foundUser) {
          foundUser = this.userRepository.create({
            email: decodedToken.email,
            password: 'firebase-auth',
            isGuest: false,
            role: 'user',
            name:
              decodedToken.name ||
              decodedToken.email?.split('@')[0] ||
              'Usuario',
          });
          foundUser = await this.userRepository.save(foundUser);
        } else {
          if (!foundUser.name || foundUser.name === 'Usuario autenticado') {
            foundUser.name =
              decodedToken.name ||
              decodedToken.email?.split('@')[0] ||
              'Usuario';
            foundUser = await this.userRepository.save(foundUser);
          }
        }
        user = foundUser;
      } catch (error) {
        console.error('Error verifying Firebase token:', error);
        throw new NotFoundException('Invalid Firebase token');
      }
    } else {
      let foundUser = await this.userRepository.findOne({
        where: { email: `guest-${userIdentifier}@temp.com` },
      });

      if (!foundUser) {
        foundUser = this.userRepository.create({
          email: `guest-${userIdentifier}@temp.com`,
          password: 'temp',
          isGuest: true,
          role: 'user',
          name: 'Usuario invitado',
        });
        foundUser = await this.userRepository.save(foundUser);
      }
      user = foundUser;
    }

    if (!session.users.some((u) => u.id === user.id)) {
      session.users.push(user);
    }

    return this.tableSessionRepository.save(session);
  }

  async create(createSessionDTO: CreateSessionDTO): Promise<TableSession> {
    var table: Table | null = await this.tableRepository.findOne({
      where: { id: createSessionDTO.tableId },
    });
    if (!table) throw new Error('Table not found');

    if (table.isBusy) {
      throw new BadRequestException(
        `Table with id ${createSessionDTO.tableId} is busy and already has an active session`,
      );
    }

    table.isBusy = true;

    try {
      this.tableService.update(createSessionDTO.tableId, table);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal Server Error: An error ocurred while trying to update the table when Creating a Table Session.`,
      );
    }

    const tableSession = {
      table: table,
    };

    return this.tableSessionRepository.save(tableSession);
  }

  findAll(): Promise<TableSession[]> {
    return this.tableSessionRepository.find();
  }

  async findById(id: number): Promise<TableSession> {
    const tableSession = await this.tableSessionRepository.findOneBy({ id });
    if (!tableSession) {
      throw new NotFoundException(`Table Session with id ${id} not found`);
    }
    return tableSession;
  }

  async findByTableId(tableId: number): Promise<TableSession> {
    const tableSession = await this.tableSessionRepository.findOne({
      where: {
        table: { id: tableId },
        closedAt: IsNull(),
      },
      relations: ['table'],
    });

    if (!tableSession) {
      throw new NotFoundException(
        `Table Session for Table ${tableId} not found`,
      );
    }

    return tableSession;
  }

  async close(id: number): Promise<TableSession> {
    const tableSession = await this.tableSessionRepository.findOneBy({ id });

    if (!tableSession) {
      throw new NotFoundException(`Table Session with id ${id} not found`);
    }

    var table: Table = await this.tableService.findById(tableSession.table.id);
    table.isBusy = false;

    try {
      this.tableService.update(table.id, table);
    } catch (error) {
      throw new InternalServerErrorException(
        `Internal Server Error: An error ocurred while trying to update the table when Deleting a Table Session.`,
      );
    }

    tableSession.closedAt = new Date();

    this.tableSessionRepository.update(tableSession.id, tableSession);
    return this.findById(tableSession.id);
  }

  confirmTable(tableId: number): Promise<TableSession> {
    /* TODO: Adapt the logic for TableSessions when implemented */
    return this.tableSessionRepository
      .findOne({
        where: { id: tableId },
        relations: ['orders'],
      })
      .then(async (table) => {
        if (!table) throw new Error('Table not found');
        if (table.orders.length === 0)
          throw new Error('No orders found for this table');

        for (const order of table.orders) {
          if (order.status == OrderStatus.Pending) {
            order.status = OrderStatus.Confirmed;
            await this.orderRepository.save(order);
          }
        }

        //TODO: Send Orders to the restaurant

        return table;
      });
  }
}
