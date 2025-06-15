import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounselingData } from './entities';
import { CreateCounselingDataDto, UpdateCounselingDataDto } from './dto';

@Injectable()
export class CounselingService {
  constructor(
    @InjectRepository(CounselingData)
    private counselingDataRepository: Repository<CounselingData>,
  ) {}

  async createCounselingData(customer: any): Promise<CounselingData> {
    const counselingData = this.counselingDataRepository.create({
      customer,
    });
    return this.counselingDataRepository.save(counselingData);
  }

  async create(
    createCounselingDataDto: CreateCounselingDataDto,
  ): Promise<CounselingData> {
    const counselingData = this.counselingDataRepository.create(
      createCounselingDataDto,
    );
    return this.counselingDataRepository.save(counselingData);
  }

  async findAll(): Promise<CounselingData[]> {
    return this.counselingDataRepository.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number): Promise<CounselingData> {
    const counselingData = await this.counselingDataRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!counselingData) {
      throw new NotFoundException(`Counseling data with ID ${id} not found`);
    }

    return counselingData;
  }

  async findByCustomerId(customerId: number): Promise<CounselingData> {
    const counselingData = await this.counselingDataRepository.findOne({
      where: { customer: { id: customerId } },
      relations: ['customer'],
    });

    if (!counselingData) {
      throw new NotFoundException(
        `Counseling data for customer with ID ${customerId} not found`,
      );
    }

    return counselingData;
  }

  async update(
    id: number,
    updateCounselingDataDto: UpdateCounselingDataDto,
  ): Promise<CounselingData> {
    const counselingData = await this.findOne(id);

    Object.assign(counselingData, updateCounselingDataDto);

    return this.counselingDataRepository.save(counselingData);
  }

  async updateByCustomerId(
    customerId: number,
    updateCounselingDataDto: UpdateCounselingDataDto,
  ): Promise<CounselingData> {
    const counselingData = await this.findByCustomerId(customerId);

    Object.assign(counselingData, updateCounselingDataDto);

    return this.counselingDataRepository.save(counselingData);
  }

  async remove(id: number): Promise<void> {
    const counselingData = await this.findOne(id);
    await this.counselingDataRepository.remove(counselingData);
  }
}
