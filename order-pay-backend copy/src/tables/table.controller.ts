import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TableService } from './table.service';
import { Table } from './table.entity';

@Controller('tables')
export class TableController {
  constructor(
    private readonly tableService: TableService,
  ) {}

  @Get()
  async findAll(): Promise<Table[]> {
    return this.tableService.findAll();
  }

  @Get()
  findById(@Param('id') id: number): Promise<Table> {
    return this.tableService.findById(+id);
  }

  @Post()
  async create(
    @Body() body: { number: number; seats: number },
  ): Promise<Table> {
    const { number, seats } = body;
    return await this.tableService.create(number, seats);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() table: Partial<Table>,
  ): Promise<Table> {
    return this.tableService.update(id, table);
  }
}
