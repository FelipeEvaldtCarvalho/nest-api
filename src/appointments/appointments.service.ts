import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto';
import { Customer } from '../customers/entities/customer.entity';
import { AuthUser } from '../auth/auth-user';
import { assertIsoDate } from '../helpers/date.helper';

const TIME_PATTERN = /^([01]?\d|2[0-3]):([0-5]\d)$/;

const toResponse = (appointment: Appointment) => ({
  id: appointment.id,
  date: appointment.date,
  time: appointment.time,
  customer: {
    id: appointment.customer?.id,
    name: appointment.customer?.name,
  },
});

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateAppointmentDto, user: AuthUser) {
    const customer = await this.customerRepository.findOne({
      where: { id: dto.customerId, user: { id: user.id } },
    });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    const time = TIME_PATTERN.exec(dto.time ?? '');
    if (!time) {
      throw new BadRequestException('Horário inválido. Use HH:mm (exemplo: 14:30)');
    }

    const saved = await this.appointmentRepository.save(
      this.appointmentRepository.create({
        customer,
        date: assertIsoDate(dto.date),
        time: `${time[1].padStart(2, '0')}:${time[2]}`,
      }),
    );
    return toResponse(saved);
  }

  // monthYear no formato MM-AAAA. Compara só datas, sem depender do fuso do servidor.
  async findByMonth(monthYear: string, user: AuthUser) {
    const match = /^(\d{1,2})-(\d{4})$/.exec(monthYear ?? '');
    const month = match ? Number(match[1]) : 0;
    if (!match || month < 1 || month > 12) {
      throw new BadRequestException('Formato inválido. Use MM-AAAA (exemplo: 03-2024)');
    }
    const year = Number(match[2]);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const pad = (n: number) => String(n).padStart(2, '0');

    const appointments = await this.appointmentRepository.find({
      where: {
        date: Between(`${year}-${pad(month)}-01`, `${year}-${pad(month)}-${pad(lastDay)}`),
        customer: { user: { id: user.id } },
      },
      relations: ['customer'],
      order: { date: 'ASC', time: 'ASC' },
    });
    return appointments.map(toResponse);
  }

  async findByCustomerId(customerId: number, user: AuthUser) {
    const appointments = await this.appointmentRepository.find({
      where: { customer: { id: customerId, user: { id: user.id } } },
      relations: ['customer'],
      order: { date: 'ASC', time: 'ASC' },
    });
    return appointments.map(toResponse);
  }

  async remove(id: number, user: AuthUser) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, customer: { user: { id: user.id } } },
      relations: ['customer'],
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    const response = toResponse(appointment);
    await this.appointmentRepository.remove(appointment);
    return response;
  }
}
