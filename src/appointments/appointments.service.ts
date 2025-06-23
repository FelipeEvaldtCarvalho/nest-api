import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ): Promise<any> {
    const customer = await this.customerRepository.findOne({
      where: { id: createAppointmentDto.customerId },
      relations: ['user'],
    });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    if (customer.user.id !== user.id) {
      throw new UnauthorizedException(
        'Você não tem permissão para criar um agendamento para este cliente',
      );
    }
    const appointmentData: Partial<Appointment> = {
      customer,
      date: new Date(createAppointmentDto.date),
      time: createAppointmentDto.time,
    };
    const appointment = this.appointmentRepository.create(appointmentData);
    const savedAppointment = await this.appointmentRepository.save(appointment);
    // Retorna apenas os campos necessários
    return {
      id: savedAppointment.id,
      date: savedAppointment.date,
      time: savedAppointment.time,
      customer: {
        id: customer.id,
        name: customer.name,
      },
    };
  }

  async findByMonth(monthYear: string, userId: number): Promise<any[]> {
    // Extrai mês e ano do formato MM-AAAA
    const [month, year] = monthYear.split('-').map(Number);

    if (!month || !year || month < 1 || month > 12) {
      throw new Error(
        'Formato inválido. Use o formato MM-AAAA (exemplo: 03-2024)',
      );
    }

    // Cria data inicial (primeiro dia do mês)
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    // Cria data final (primeiro dia do próximo mês)
    const endDate = new Date(year, month, 1);
    endDate.setHours(0, 0, 0, 0);

    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('appointment.date >= :startDate', { startDate })
      .andWhere('appointment.date < :endDate', { endDate })
      .andWhere('user.id = :userId', { userId })
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.time', 'ASC')
      .getMany();

    // Formata a resposta mantendo o formato original da data e hora
    return appointments.map((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return {
        id: appointment.id,
        date: appointmentDate.toISOString().slice(0, 10), // Formato YYYY-MM-DD
        time: appointment.time,
        customer: {
          id: appointment.customer?.id,
          name: appointment.customer?.name,
        },
      };
    });
  }

  async findByCustomerId(customerId: number, userId: number): Promise<any[]> {
    const appointments = await this.appointmentRepository.find({
      where: { customer: { id: customerId, user: { id: userId } } },
      relations: ['customer', 'customer.user'],
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      customer: {
        id: appointment.customer?.id,
        name: appointment.customer?.name,
      },
    }));
  }

  async remove(id: number, userId: number): Promise<any> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['customer', 'customer.user'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento não encontrado`);
    }

    if (appointment.customer.user.id !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover este agendamento',
      );
    }

    await this.appointmentRepository.remove(appointment);

    return {
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      customer: {
        id: appointment.customer?.id,
        name: appointment.customer?.name,
      },
    };
  }
}
