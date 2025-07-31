import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { Repository } from 'typeorm';
import { Table } from './table.entity';
import { Order } from 'src/orders/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatus } from 'src/orders/order-status';

describe('TableService - confirmTable', () => {
  let service: TableService;
  let tableRepo: jest.Mocked<Repository<Table>>;
  let orderRepo: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: getRepositoryToken(Table),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    tableRepo = module.get(getRepositoryToken(Table));
    orderRepo = module.get(getRepositoryToken(Order));
  });

  it('should confirm all orders for a table', async () => {
    const mockOrders = [{ id: 1, status: OrderStatus.Pending }, { id: 2, status: OrderStatus.Pending }] as Order[];

    tableRepo.findOne.mockResolvedValue({
      id: 1,
      orders: mockOrders,
    } as Table);

    orderRepo.save.mockImplementation(async (order: Order) => ({
      ...order,
      id: order.id ?? 1,
      status: order.status,
      table: order.table,
      restaurant: order.restaurant,
      items: order.items,
      createdAt: order.createdAt,
    } as Order));

    const result = await service.confirmTable(1);

    expect(result.id).toBe(1);
    expect(orderRepo.save).toHaveBeenCalledTimes(2);
    for (const order of mockOrders) {
      expect(order.status).toBe(OrderStatus.Confirmed);
    }
  });

  it('should throw if table not found', async () => {
    tableRepo.findOne.mockResolvedValue(null);

    await expect(service.confirmTable(1)).rejects.toThrow('Table not found');
  });

  it('should throw if table has no orders', async () => {
    tableRepo.findOne.mockResolvedValue({
      id: 1,
      number: 1,
      seats: 4,
      restaurant: {
        id: 1,
        name: 'Test Restaurant',
        address: '123 Main St',
        phone: '123-456-7890',
        email: 'test@example.com',
        tables: [],
        orders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        products: [],
      },
      orders: [],
    } as Table);

    await expect(service.confirmTable(1)).rejects.toThrow('No orders found for this table');
  });

  it('should only confirm and save orders with status Pending', async () => {
    const mockOrders = [
        { id: 1, status: OrderStatus.Pending },
        { id: 2, status: OrderStatus.Confirmed }, // ya confirmada
        { id: 3, status: OrderStatus.Pending },
    ] as Order[];

    tableRepo.findOne.mockResolvedValue({
        id: 1,
        orders: mockOrders,
    } as Table);

    orderRepo.save.mockImplementation(async (order: Order) => ({
        ...order,
    } as Order));

    const result = await service.confirmTable(1);

    expect(result.id).toBe(1);
    expect(orderRepo.save).toHaveBeenCalledTimes(2); // solo 2 Pending
    expect(mockOrders[0].status).toBe(OrderStatus.Confirmed);
    expect(mockOrders[1].status).toBe(OrderStatus.Confirmed); // no cambia
    expect(mockOrders[2].status).toBe(OrderStatus.Confirmed);
    });

});
