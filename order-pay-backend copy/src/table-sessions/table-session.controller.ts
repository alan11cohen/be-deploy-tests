import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TableSession } from './table-session.entity';
import { TableSessionService } from './table-session.service';
import { CreateSessionDTO } from './dtos/create-session-dto';
import { JoinSessionDto } from './dtos/table-session-dto';

@Controller('table-sessions')
export class TableSessionController {
  constructor(private readonly tableSessionService: TableSessionService) {}

  @Get()
  async findAll(): Promise<TableSession[]> {
    return this.tableSessionService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<TableSession> {
    return this.tableSessionService.findById(+id);
  }

  @Post()
  async create(@Body() body: CreateSessionDTO): Promise<TableSession> {
    return await this.tableSessionService.create(body);
  }

  @Delete(':id')
  async close(@Param('id') id: number): Promise<TableSession> {
    return await this.tableSessionService.close(id);
  }

  @Get('active-by-table-id/:id')
  async getSessionByTableId(
    @Param('id') tableId: number,
  ): Promise<TableSession> {
    return await this.tableSessionService.findByTableId(tableId);
  }

  @Post(':id/confirm')
  /* TODO: Change to something like /:id/sessions/confirm when TableSessions are implemented */
  async confirmOrders(@Param('id') id: number): Promise<TableSession> {
    return await this.tableSessionService.confirmTable(id);
  }

  @Post('join/:code')
  async joinTable(
    @Param('code') code: string,
    @Body() dto: JoinSessionDto,
  ): Promise<{ session: TableSession }> {
    const session = await this.tableSessionService.joinSessionByTableCode(
      code,
      dto,
    );
    return { session };
  }
}
