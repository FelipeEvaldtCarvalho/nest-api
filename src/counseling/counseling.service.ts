import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounselingData } from './entities';
import { UpdateCounselingDataDto } from './dto';
import { Customer } from '../customers/entities/customer.entity';
import { AuthUser } from '../auth/auth-user';

const EDITABLE_FIELDS = [
  'reason',
  'symptomsTime',
  'dailyLife',
  'hasHadTherapy',
  'expectations',
] as const;

@Injectable()
export class CounselingService {
  constructor(
    @InjectRepository(CounselingData)
    private counselingDataRepository: Repository<CounselingData>,
  ) {}

  // Chamado ao cadastrar o cliente: toda ficha nasce com a entrevista vazia.
  createCounselingData(customer: Customer): Promise<CounselingData> {
    return this.counselingDataRepository.save(
      this.counselingDataRepository.create({ customer }),
    );
  }

  async findByCustomerId(customerId: number, user: AuthUser): Promise<CounselingData> {
    const counselingData = await this.counselingDataRepository.findOne({
      where: { customer: { id: customerId, user: { id: user.id } } },
    });

    if (!counselingData) {
      throw new NotFoundException('Dados de aconselhamento não encontrados');
    }

    return counselingData;
  }

  async updateByCustomerId(
    customerId: number,
    dto: UpdateCounselingDataDto,
    user: AuthUser,
  ): Promise<CounselingData> {
    const counselingData = await this.findByCustomerId(customerId, user);

    // Só os campos da entrevista: o vínculo com o cliente nunca muda por aqui.
    for (const field of EDITABLE_FIELDS) {
      if (dto[field] !== undefined) counselingData[field] = dto[field];
    }

    return this.counselingDataRepository.save(counselingData);
  }
}
