import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Table } from './table.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  async create(number: number, seats: number): Promise<Table> {
    const qrCode = `table-${number}`; // TODO: Revisar como usarlo. Por ahora se usa el numero de la mesa. Se tiene un qr que el front digiere y manda solo el nro de mesa

    const table = this.tableRepository.create({ number, seats, qrCode });

    return this.tableRepository.save(table);
  }

  findAll(): Promise<Table[]> {
    return this.tableRepository.find();
  }

  async findByCode(qrCode: string): Promise<Table | null> {
    return this.tableRepository.findOne({
      where: { qrCode },
      relations: ['users'],
    });
  }

  async findById(id: number): Promise<Table> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  async update(id: number, table: Partial<Table>): Promise<Table> {
    await this.tableRepository.update(id, table);
    return this.findById(id);
  }
}
