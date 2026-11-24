import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthUser, CurrentUser } from '../auth/auth-user';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.create(dto, user);
  }

  @Get('month/:month')
  findByMonth(@Param('month') month: string, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.findByMonth(month, user);
  }

  @Get('customer/:customerId')
  findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.appointmentsService.findByCustomerId(customerId, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.appointmentsService.remove(id, user);
  }
}
