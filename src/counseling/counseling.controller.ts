import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CounselingService } from './counseling.service';
import { CreateCounselingDataDto, UpdateCounselingDataDto } from './dto';

@Controller('counseling')
export class CounselingController {
  constructor(private readonly counselingService: CounselingService) {}

  @Post()
  create(@Body() createCounselingDataDto: CreateCounselingDataDto) {
    return this.counselingService.create(createCounselingDataDto);
  }

  @Get()
  findAll() {
    return this.counselingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.counselingService.findOne(id);
  }

  @Get('customer/:customerId')
  findByCustomerId(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.counselingService.findByCustomerId(customerId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCounselingDataDto: UpdateCounselingDataDto,
  ) {
    return this.counselingService.update(id, updateCounselingDataDto);
  }

  @Patch('customer/:customerId')
  updateByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() updateCounselingDataDto: UpdateCounselingDataDto,
  ) {
    return this.counselingService.updateByCustomerId(
      customerId,
      updateCounselingDataDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.counselingService.remove(id);
  }
}
