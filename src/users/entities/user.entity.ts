import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

export const USER_ROLES = ['admin', 'operator'] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // select: false -> o hash nunca sai em consultas comuns; só quando pedido explicitamente.
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 20, default: 'operator' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];
}
