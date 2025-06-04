import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    const customer = this.customersRepository.create({
      ...createCustomerDto,
      user: { id: userId },
    });
    return this.customersRepository.save(customer);
  }

  findAll() {
    return this.customersRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.customersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.customersRepository.update(id, updateCustomerDto);
  }

  remove(id: number) {
    return this.customersRepository.delete(id);
  }
}
