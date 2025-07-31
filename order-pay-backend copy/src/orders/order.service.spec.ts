import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Table } from '../tables/table.entity';
import { Product } from '../products/product.entity';
import { OrderProductDetails } from './order-product-details.entity';
import { ProductOption } from 'src/product-options/product-options.entity';
import { ProductOptionValue } from 'src/product-option-values/product-option-values.entity';
import { OrderProductOption } from './order-product-option.entity';

describe('OrderService', () => {
  let service: OrderService;

  const mockRepo = () => ({
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  });

  let tableRepo: ReturnType<typeof mockRepo>;
  let orderRepo: ReturnType<typeof mockRepo>;
  let productRepo: ReturnType<typeof mockRepo>;
  let orderItemRepo: ReturnType<typeof mockRepo>;
  let productOptionRepo: ReturnType<typeof mockRepo>;
  let optionValueRepo: ReturnType<typeof mockRepo>;
  let orderProductOptionRepo: ReturnType<typeof mockRepo>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useFactory: mockRepo },
        { provide: getRepositoryToken(Table), useFactory: mockRepo },
        { provide: getRepositoryToken(Product), useFactory: mockRepo },
        { provide: getRepositoryToken(OrderProductDetails), useFactory: mockRepo },
        { provide: getRepositoryToken(ProductOption), useFactory: mockRepo },
        { provide: getRepositoryToken(ProductOptionValue), useFactory: mockRepo },
        { provide: getRepositoryToken(OrderProductOption), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(OrderService);
    tableRepo = module.get(getRepositoryToken(Table));
    orderRepo = module.get(getRepositoryToken(Order));
    productRepo = module.get(getRepositoryToken(Product));
    orderItemRepo = module.get(getRepositoryToken(OrderProductDetails));
    productOptionRepo = module.get(getRepositoryToken(ProductOption));
    optionValueRepo = module.get(getRepositoryToken(ProductOptionValue));
    orderProductOptionRepo = module.get(getRepositoryToken(OrderProductOption));
  });

  it('should create an order with product options', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue({ id: 3 });
    orderItemRepo.save.mockResolvedValue({ id: 10 });
    productOptionRepo.findOneBy.mockResolvedValue({ id: 4, product: { id: 3 } });
    optionValueRepo.findBy.mockResolvedValue([{ id: 9, productOption: { id: 4 } }]);
    orderProductOptionRepo.save.mockResolvedValue({});
    orderRepo.findOne.mockResolvedValue({ id: 1, table: { id: 1 }, items: [] });

    const result = await service.createOrder({
      tableId: 1,
      restaurantId: 1,
      products: [
        {
          productId: 3,
          quantity: 2,
          productOptions: [
            {
              productOptionId: 4,
              productOptionValues: [9],
            },
          ],
          note: 'Sin cebolla',
        },
      ],
    });

    expect(result).toHaveProperty('id', 1);
    expect(orderRepo.save).toHaveBeenCalled();
    expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: 3 });
    expect(orderItemRepo.save).toHaveBeenCalled();
    expect(orderProductOptionRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        orderProduct: { id: 10 },
        productOption: expect.objectContaining({ id: 4 }),
        values: [
          expect.objectContaining({
            id: 9,
            productOption: expect.objectContaining({ id: 4 }),
          }),
        ],
      }),
    );
  });

  it('should throw if table is not found', async () => {
    tableRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.createOrder({
        tableId: 99,
        restaurantId: 1,
        products: [],
      }),
    ).rejects.toThrow('Table not found');
  });

  it('should throw if product is not found', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [{ productId: 123, quantity: 1 }],
      }),
    ).rejects.toThrow('Product with ID 123 not found');
  });

  it('should throw if product option is not found', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue({ id: 3 });
    orderItemRepo.save.mockResolvedValue({ id: 10 });
    productOptionRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [
          {
            productId: 3,
            quantity: 1,
            productOptions: [
              {
                productOptionId: 99,
                productOptionValues: [1],
              },
            ],
          },
        ],
      }),
    ).rejects.toThrow('ProductOption 99 not found');
  });

  it('should throw if product option values are missing', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue({ id: 3 });
    orderItemRepo.save.mockResolvedValue({ id: 10 });
    productOptionRepo.findOneBy.mockResolvedValue({ id: 4, product: { id: 3 } });
    optionValueRepo.findBy.mockResolvedValue([{ id: 9, productOption: { id: 4 } }]);
    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [
          {
            productId: 3,
            quantity: 1,
            productOptions: [
              {
                productOptionId: 4,
                productOptionValues: [9, 10],
              },
            ],
          },
        ],
      }),
    ).rejects.toThrow('Some ProductOptionValues not found for option 4');
  });

  it('should throw if some ProductOptionValues do not belong to the given ProductOption', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue({ id: 3 });
    orderItemRepo.save.mockResolvedValue({ id: 10 });
    productOptionRepo.findOneBy.mockResolvedValue({ id: 4, product: { id: 3 } });

    optionValueRepo.findBy.mockResolvedValue([
      { id: 9, productOption: { id: 4 } },
      { id: 10, productOption: { id: 999 } },
    ]);

    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [
          {
            productId: 3,
            quantity: 1,
            productOptions: [
              {
                productOptionId: 4,
                productOptionValues: [9, 10],
              },
            ],
          },
        ],
      }),
    ).rejects.toThrow('Some ProductOptionValues do not belong to ProductOption 4');
  });

  it('should throw if ProductOption does not belong to the Product', async () => {
    tableRepo.findOne.mockResolvedValue({ id: 1, restaurant: { id: 1 } });
    orderRepo.save.mockResolvedValue({ id: 1 });
    productRepo.findOneBy.mockResolvedValue({ id: 3 });
    orderItemRepo.save.mockResolvedValue({ id: 10 });

    productOptionRepo.findOneBy.mockResolvedValue({ id: 4, product: { id: 999 } });

    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [
          {
            productId: 3,
            quantity: 1,
            productOptions: [
              {
                productOptionId: 4,
                productOptionValues: [],
              },
            ],
          },
        ],
      }),
    ).rejects.toThrow('ProductOption 4 does not belong to Product 3');
  });

  it('should throw if table does not belong to the specified restaurant', async () => {
    tableRepo.findOne.mockResolvedValue({
      id: 1, restaurant: { id: 999 },
    });

    await expect(
      service.createOrder({
        tableId: 1,
        restaurantId: 1,
        products: [],
      }),
    ).rejects.toThrow('Table 1 does not belong to Restaurant 1');
  });
});