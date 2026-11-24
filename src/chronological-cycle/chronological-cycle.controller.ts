import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../auth/auth-user';
import { ChronologicalCycleService } from './chronological-cycle.service';
import {
  CreateChronologicalCycleDto,
  UpdateChronologicalCycleDto,
  UpdateOrderDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('chronological-cycle')
export class ChronologicalCycleController {
  constructor(private readonly service: ChronologicalCycleService) {}

  @Post()
  create(@Body() dto: CreateChronologicalCycleDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user);
  }

  // Precisa vir antes de ':id' para não ser capturada como id.
  @Post('order')
  @HttpCode(204)
  updateOrder(@Body() items: UpdateOrderDto[], @CurrentUser() user: AuthUser) {
    return this.service.updateOrder(items, user);
  }

  @Get('customer/:customerId')
  findAllByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.findAllByCustomerId(customerId, user);
  }

  @Get('customer/:customerId/date/:date')
  findByCustomerIdAndDate(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('date') date: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.findByCustomerIdAndDate(customerId, date, user);
  }

  @Get('next-order/:customerId')
  async getNextOrder(
    @Param('customerId', ParseIntPipe) customerId: number,
    @CurrentUser() user: AuthUser,
    @Query('date') date?: string,
  ) {
    return { nextOrder: await this.service.getNextOrder(customerId, user, date || undefined) };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.service.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateChronologicalCycleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user);
  }
}
