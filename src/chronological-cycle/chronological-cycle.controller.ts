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
} from '@nestjs/common';
import { ChronologicalCycleService } from './chronological-cycle.service';
import {
  CreateChronologicalCycleDto,
  UpdateChronologicalCycleDto,
} from './dto';

@Controller('chronological-cycle')
export class ChronologicalCycleController {
  constructor(
    private readonly chronologicalCycleService: ChronologicalCycleService,
  ) {}

  @Post()
  create(@Body() createChronologicalCycleDto: CreateChronologicalCycleDto) {
    return this.chronologicalCycleService.create(createChronologicalCycleDto);
  }

  @Get()
  findAll() {
    return this.chronologicalCycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chronologicalCycleService.findOne(id);
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.chronologicalCycleService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/date/:date')
  findByCustomerIdAndDate(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('date') date: string,
  ) {
    const dateParam = new Date(date);
    return this.chronologicalCycleService.findByCustomerIdAndDate(
      customerId,
      dateParam,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChronologicalCycleDto: UpdateChronologicalCycleDto,
  ) {
    return this.chronologicalCycleService.update(
      id,
      updateChronologicalCycleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chronologicalCycleService.remove(id);
  }
}
