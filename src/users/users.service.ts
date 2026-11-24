import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, USER_ROLES, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const email = this.normalizeEmail(dto.email);
    this.assertPassword(dto.password);
    const role = this.parseRole(dto.role ?? 'operator');

    if (await this.usersRepository.exists({ where: { email } })) {
      throw new ConflictException('Já existe um usuário com este e-mail');
    }

    const user = this.usersRepository.create({
      email,
      name: dto.name?.trim() || null,
      role,
      password: await bcrypt.hash(dto.password, 10),
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.id);
  }

  findAll() {
    return this.usersRepository.find({ order: { name: 'ASC', email: 'ASC' } });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmailWithPassword(email: string) {
    if (!email) return null;
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: this.normalizeEmail(email) })
      .getOne();
  }

  async update(id: number, dto: UpdateUserDto, actingUserId: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const changes: Partial<User> = {};

    if (dto.email !== undefined) {
      const email = this.normalizeEmail(dto.email);
      const owner = await this.usersRepository.findOne({ where: { email } });
      if (owner && owner.id !== id) {
        throw new ConflictException('Já existe um usuário com este e-mail');
      }
      changes.email = email;
    }
    if (dto.name !== undefined) changes.name = dto.name?.trim() || null;
    if (dto.password !== undefined) {
      this.assertPassword(dto.password);
      changes.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.role !== undefined) changes.role = this.parseRole(dto.role);
    if (dto.isActive !== undefined) changes.isActive = !!dto.isActive;

    // O admin não pode se trancar para fora do sistema.
    if (id === actingUserId && (changes.isActive === false || changes.role === 'operator')) {
      throw new BadRequestException('Você não pode desativar nem rebaixar a própria conta');
    }

    if (Object.keys(changes).length) {
      await this.usersRepository.update(id, changes);
    }
    return this.findOne(id);
  }

  async remove(id: number, actingUserId: number) {
    if (id === actingUserId) {
      throw new BadRequestException('Você não pode excluir a própria conta');
    }
    const result = await this.usersRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Usuário não encontrado');
  }

  private normalizeEmail(email: string) {
    const normalized = email?.trim().toLowerCase();
    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new BadRequestException('E-mail inválido');
    }
    return normalized;
  }

  private assertPassword(password: string) {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(
        `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`,
      );
    }
  }

  private parseRole(role: string): UserRole {
    if (!USER_ROLES.includes(role as UserRole)) {
      throw new BadRequestException(`Papel inválido: use ${USER_ROLES.join(' ou ')}`);
    }
    return role as UserRole;
  }
}
