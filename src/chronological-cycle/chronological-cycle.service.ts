import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChronologicalCycle } from './entities/chronological-cycle.entity';
import {
  CreateChronologicalCycleDto,
  UpdateChronologicalCycleDto,
} from './dto';

@Injectable()
export class ChronologicalCycleService {
  constructor(
    @InjectRepository(ChronologicalCycle)
    private chronologicalCycleRepository: Repository<ChronologicalCycle>,
  ) {}

  async create(
    createChronologicalCycleDto: CreateChronologicalCycleDto,
  ): Promise<ChronologicalCycle> {
    const chronologicalCycle = this.chronologicalCycleRepository.create(
      createChronologicalCycleDto,
    );
    return this.chronologicalCycleRepository.save(chronologicalCycle);
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
    date: Date,
  ): Promise<ChronologicalCycle[]> {
    return this.chronologicalCycleRepository.find({
      where: { customer: { id: customerId }, date },
      relations: ['customer'],
      order: {
        order: 'ASC',
      },
    });
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

  async remove(id: number): Promise<void> {
    const chronologicalCycle = await this.findOne(id);
    await this.chronologicalCycleRepository.remove(chronologicalCycle);
  }

  async getNextOrder(customerId: number, date?: Date): Promise<number> {
    if (date) {
      // Se uma data específica for fornecida, obter a próxima ordem para essa data
      const lastCycle = await this.chronologicalCycleRepository.findOne({
        where: {
          customer: { id: customerId },
          date: date,
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
