import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateAppointmentDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: Request & { user: User },
  ) {
    console.log(createAppointmentDto);
    const user = request.user;
    return this.appointmentsService.create(createAppointmentDto, user);
  }

  @Get('month/:month')
  async findByMonth(
    @Param('month') month: string,
    @Req() request: Request & { user: User },
  ) {
    const user = request.user;
    return this.appointmentsService.findByMonth(month, user.id);
  }

  @Get('customer/:customerId')
  async findByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Req() request: Request & { user: User },
  ) {
    const user = request.user;
    return this.appointmentsService.findByCustomerId(customerId, user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: User },
  ) {
    const user = request.user;
    return this.appointmentsService.remove(id, user.id);
  }
}
