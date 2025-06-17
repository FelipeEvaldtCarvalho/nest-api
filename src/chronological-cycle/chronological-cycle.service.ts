import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChronologicalCycle } from './entities/chronological-cycle.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class ChronologicalCycleService {
  constructor(
    @InjectRepository(ChronologicalCycle)
    private chronologicalCycleRepository: Repository<ChronologicalCycle>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(
    createChronologicalCycleDto: CreateChronologicalCycleDto,
  ): Promise<ChronologicalCycle> {
    const { customerId, order, ...cycleData } = createChronologicalCycleDto;

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    let finalOrder = order;
    if (!order) {
      finalOrder = await this.getNextOrder(customerId, cycleData.date);
    }

    const chronologicalCycle = this.chronologicalCycleRepository.create({
      ...cycleData,
      customer,
      order: finalOrder,
    });

    const savedCycle =
      await this.chronologicalCycleRepository.save(chronologicalCycle);

    const { customer: _, ...cycleWithoutCustomer } = savedCycle;
    return cycleWithoutCustomer as ChronologicalCycle;
  }

  async findAll(): Promise<ChronologicalCycle[]> {
    return this.chronologicalCycleRepository.find({
      relations: ['customer'],
      order: {
        date: 'ASC',
        order: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<ChronologicalCycle> {
    const chronologicalCycle = await this.chronologicalCycleRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!chronologicalCycle) {
      throw new NotFoundException(
        `Chronological cycle with ID ${id} not found`,
      );
    }

    return chronologicalCycle;
  }

  async findByCustomerIdAndDate(
    customerId: number,
    date: string,
  ): Promise<ChronologicalCycle[]> {
    const dateString = date;

    const results = await this.chronologicalCycleRepository.find({
      where: {
        customer: { id: customerId },
        date: dateString as any,
      },
      relations: ['customer'],
      order: {
        order: 'ASC',
      },
    });

    return results;
  }

  async findByCustomerId(customerId: number): Promise<ChronologicalCycle[]> {
    return this.chronologicalCycleRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer'],
      order: {
        date: 'ASC',
        order: 'ASC',
      },
    });
  }

  async update(
    id: number,
    updateChronologicalCycleDto: UpdateChronologicalCycleDto,
  ): Promise<ChronologicalCycle> {
    const chronologicalCycle = await this.findOne(id);

    Object.assign(chronologicalCycle, updateChronologicalCycleDto);

    return this.chronologicalCycleRepository.save(chronologicalCycle);
  }

  async updateOrder(orderList: { [key: number]: number }): Promise<void> {
    const chronologicalCycles = await this.chronologicalCycleRepository.find({
      where: { id: In(Object.keys(orderList)) },
    });

    for (const chronologicalCycle of chronologicalCycles) {
      chronologicalCycle.order = orderList[chronologicalCycle.id];
    }

    await this.chronologicalCycleRepository.save(chronologicalCycles);
  }

  async remove(id: number): Promise<void> {
    const chronologicalCycle = await this.findOne(id);
    await this.chronologicalCycleRepository.remove(chronologicalCycle);
  }
  async getNextOrder(customerId: number, date?: string): Promise<any> {
    if (date) {
      const dateString = date;
      const lastCycle = await this.chronologicalCycleRepository.findOne({
        where: {
          customer: { id: customerId },
          date: dateString as any,
        },
        order: { order: 'DESC' },
      });
      return lastCycle ? lastCycle.order + 1 : 1;
    } else {
      // Se nenhuma data for fornecida, obter a próxima ordem geral
      const lastCycle = await this.chronologicalCycleRepository.findOne({
        where: { customer: { id: customerId } },
        order: {
          date: 'DESC',
          order: 'DESC',
        },
      });
      return lastCycle ? lastCycle.order + 1 : 1;
    }
  }
}
