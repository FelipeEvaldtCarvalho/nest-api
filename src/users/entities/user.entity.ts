import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];
}
