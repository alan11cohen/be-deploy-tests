import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { Table } from '../tables/table.entity';
import { Product } from '../products/product.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderProductDetails } from './order-product-details.entity';
import { ProductOption } from 'src/product-options/product-options.entity';
import { ProductOptionValue } from 'src/product-option-values/product-option-values.entity';
import { OrderProductOption } from './order-product-option.entity';
import { TableSession } from 'src/table-sessions/table-session.entity';
import { OrderStatus } from './order-status';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,

    @InjectRepository(TableSession)
    private readonly tableSessionRepository: Repository<TableSession>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(OrderProductDetails)
    private readonly orderProductDetailsRepository: Repository<OrderProductDetails>,

    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,

    @InjectRepository(ProductOptionValue)
    private readonly productOptionValueRepository: Repository<ProductOptionValue>,

    @InjectRepository(OrderProductOption)
    private readonly orderProductOptionRepository: Repository<OrderProductOption>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const table = await this.tableRepository.findOne({
      where: { id: dto.tableId },
      relations: ['restaurant'],
    });

    if (!table) throw new Error('Table not found');
    if (table.restaurant.id !== dto.restaurantId)
      throw new Error(
        `Table ${table.id} does not belong to Restaurant ${dto.restaurantId}`,
      );

    const tableSession = await this.tableSessionRepository.findOne({
      where: { id: dto.tableSessionId },
    });

    if (!tableSession) throw new Error('Table Session not found');
    if (tableSession.closedAt != null)
      throw new Error(
        `Table Session ${dto.tableSessionId} has already been closed.`,
      );

    //TODO: Validate user (JWT) belongs to that table

    const order = await this.orderRepository.save({
      table,
      tableSession,
      restaurant: table.restaurant,
      status: OrderStatus.Pending,
    });

    for (const p of dto.products) {
      const product = await this.productRepository.findOneBy({
        id: p.productId,
      });
      if (!product) throw new Error(`Product with ID ${p.productId} not found`);

      const orderProduct = await this.orderProductDetailsRepository.save({
        order,
        product,
        quantity: p.quantity,
        note: p.note,
      });

      if (p.productOptions?.length) {
        for (const option of p.productOptions) {
          const productOption = await this.productOptionRepository.findOne({
            where: { id: option.productOptionId },
            relations: ['product'],
          });
          if (!productOption) {
            throw new Error(
              `ProductOption ${option.productOptionId} not found`,
            );
          }

          if (productOption.product.id !== product.id) {
            throw new Error(
              `ProductOption ${option.productOptionId} does not belong to Product ${product.id}`,
            );
          }

          const values = await this.productOptionValueRepository.find({
            where: { id: In(option.productOptionValues) },
            relations: ['productOption'],
          });

          if (values.length !== option.productOptionValues.length) {
            throw new Error(
              `Some ProductOptionValues not found for option ${option.productOptionId}`,
            );
          }

          const invalidValue = values.find(
            (v) => v.productOption.id !== productOption.id,
          );
          if (invalidValue) {
            throw new Error(
              `Some ProductOptionValues do not belong to ProductOption ${productOption.id}`,
            );
          }

          await this.orderProductOptionRepository.save({
            orderProduct,
            productOption,
            values,
          });
        }
      }
    }

    return this.orderRepository.findOne({
      where: { id: order.id },
      relations: [
        'tableSession',
        'items',
        'items.product',
        'items.selectedOptions',
        'items.selectedOptions.productOption',
        'items.selectedOptions.values',
      ],
    });
  }

  async getAllOrders() {
    return this.orderRepository.find({
      relations: [
        'tableSession',
        'items',
        'items.product',
        'items.selectedOptions',
        'items.selectedOptions.productOption',
        'items.selectedOptions.values',
      ],
    });
  }
}
