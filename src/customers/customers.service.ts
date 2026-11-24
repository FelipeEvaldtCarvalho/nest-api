import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CounselingService } from '../counseling/counseling.service';
import { AuthUser } from '../auth/auth-user';

const PG_UNIQUE_VIOLATION = '23505';
const EDITABLE_FIELDS = ['name', 'document', 'birthdate', 'address', 'phone'] as const;

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly counselingService: CounselingService,
  ) {}

  async create(dto: CreateCustomerDto, user: AuthUser) {
    const customer = this.customersRepository.create({
      ...this.pickFields(dto),
      user: { id: user.id },
    });

    const saved = await this.saveHandlingDuplicates(customer);
    await this.counselingService.createCounselingData(saved);
    return this.findOne(saved.id, user);
  }

  findAll(user: AuthUser) {
    return this.customersRepository.find({
      where: { user: { id: user.id } },
      order: { name: 'ASC' },
    });
  }

  countByUser(user: AuthUser) {
    return this.customersRepository.count({ where: { user: { id: user.id } } });
  }

  // Só encontra clientes do próprio operador: ID de outro operador responde 404.
  async findOne(id: number, user: AuthUser) {
    const customer = await this.customersRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return customer;
  }

  async update(id: number, dto: UpdateCustomerDto, user: AuthUser) {
    const customer = await this.findOne(id, user);
    Object.assign(customer, this.pickFields(dto));
    return this.saveHandlingDuplicates(customer);
  }

  async remove(id: number, user: AuthUser) {
    const customer = await this.findOne(id, user);
    await this.customersRepository.remove(customer);
  }

  // Aceita só os campos editáveis e transforma texto vazio em null
  // (senão vários clientes sem CPF colidem na regra de CPF único).
  private pickFields(dto: Partial<CreateCustomerDto>) {
    const data: Partial<Customer> = {};
    for (const field of EDITABLE_FIELDS) {
      const raw = dto[field];
      if (raw === undefined) continue;
      const value = typeof raw === 'string' ? raw.trim() : raw;
      data[field] = value === '' ? null : value;
    }
    return data;
  }

  private async saveHandlingDuplicates(customer: Customer) {
    try {
      return await this.customersRepository.save(customer);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as any).driverError?.code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException('Já existe um cliente com este CPF');
      }
      throw err;
    }
  }
}
