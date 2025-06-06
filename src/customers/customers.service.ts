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

  async create(createCustomerDto: CreateCustomerDto, userPayload: User) {
    const user = await this.usersRepository.findOneBy({ id: userPayload.id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const customer = this.customersRepository.create({
      ...createCustomerDto,
      user,
    });

    return this.customersRepository.save(customer);
  }

  findAll(user: User) {
    return this.customersRepository.find({
      where: { user: { id: user.id } },
    });
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
