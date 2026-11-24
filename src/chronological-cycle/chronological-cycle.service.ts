import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChronologicalCycle } from './entities/chronological-cycle.entity';
import { Customer } from '../customers/entities/customer.entity';
import {
  CreateChronologicalCycleDto,
  UpdateChronologicalCycleDto,
  UpdateOrderDto,
} from './dto';
import { AuthUser } from '../auth/auth-user';
import { assertIsoDate } from '../helpers/date.helper';

const EDITABLE_FIELDS = ['cycle', 'fase', 'emotionalScale', 'physicalScale'] as const;

// Todas as operações filtram pelo dono do cliente: um operador nunca enxerga
// nem altera ciclos de clientes de outro operador.
@Injectable()
export class ChronologicalCycleService {
  constructor(
    @InjectRepository(ChronologicalCycle)
    private chronologicalCycleRepository: Repository<ChronologicalCycle>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateChronologicalCycleDto, user: AuthUser) {
    const customer = await this.findOwnedCustomer(dto.customerId, user);
    const date = assertIsoDate(dto.date);

    const cycle = this.chronologicalCycleRepository.create({
      customer,
      date,
      order: dto.order || (await this.getNextOrder(customer.id, user, date)),
    });
    for (const field of EDITABLE_FIELDS) {
      if (dto[field] !== undefined) cycle[field] = dto[field];
    }

    const saved = await this.chronologicalCycleRepository.save(cycle);
    const { customer: _, ...cycleWithoutCustomer } = saved;
    return cycleWithoutCustomer;
  }

  // Ciclos agrupados por data (mais recente primeiro), na ordem definida pelo operador.
  async findAllByCustomerId(customerId: number, user: AuthUser) {
    await this.findOwnedCustomer(customerId, user);
    const cycles = await this.chronologicalCycleRepository.find({
      where: { customer: { id: customerId } },
      order: { date: 'DESC', order: 'ASC' },
    });

    const result: Record<string, ChronologicalCycle[]> = {};
    for (const cycle of cycles) {
      (result[cycle.date] ??= []).push(cycle);
    }
    return result;
  }

  async findOne(id: number, user: AuthUser) {
    const cycle = await this.chronologicalCycleRepository.findOne({
      where: { id, customer: { user: { id: user.id } } },
    });
    if (!cycle) {
      throw new NotFoundException('Ciclo cronológico não encontrado');
    }
    return cycle;
  }

  async findByCustomerIdAndDate(customerId: number, date: string, user: AuthUser) {
    await this.findOwnedCustomer(customerId, user);
    return this.chronologicalCycleRepository.find({
      where: { customer: { id: customerId }, date: assertIsoDate(date) },
      order: { order: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateChronologicalCycleDto, user: AuthUser) {
    const cycle = await this.findOne(id, user);
    for (const field of EDITABLE_FIELDS) {
      if (dto[field] !== undefined) cycle[field] = dto[field];
    }
    if (dto.date !== undefined) cycle.date = assertIsoDate(dto.date);
    if (dto.order !== undefined) cycle.order = dto.order;
    return this.chronologicalCycleRepository.save(cycle);
  }

  async updateOrder(items: UpdateOrderDto[], user: AuthUser): Promise<void> {
    if (!Array.isArray(items) || !items.length) return;

    const cycles = await this.chronologicalCycleRepository.find({
      where: {
        id: In(items.map((item) => item.id)),
        customer: { user: { id: user.id } },
      },
    });
    if (cycles.length !== items.length) {
      throw new NotFoundException('Ciclo cronológico não encontrado');
    }

    for (const cycle of cycles) {
      cycle.order = items.find((item) => item.id === cycle.id).order;
    }
    await this.chronologicalCycleRepository.save(cycles);
  }

  async remove(id: number, user: AuthUser): Promise<void> {
    const cycle = await this.findOne(id, user);
    await this.chronologicalCycleRepository.remove(cycle);
  }

  async getNextOrder(customerId: number, user: AuthUser, date?: string) {
    await this.findOwnedCustomer(customerId, user);
    const lastCycle = await this.chronologicalCycleRepository.findOne({
      where: {
        customer: { id: customerId },
        ...(date ? { date: assertIsoDate(date) } : {}),
      },
      order: { date: 'DESC', order: 'DESC' },
    });
    return lastCycle ? lastCycle.order + 1 : 1;
  }

  private async findOwnedCustomer(customerId: number, user: AuthUser) {
    if (!customerId) throw new BadRequestException('Cliente não informado');
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, user: { id: user.id } },
    });
    if (!customer) throw new NotFoundException('Cliente não encontrado');
    return customer;
  }
}
