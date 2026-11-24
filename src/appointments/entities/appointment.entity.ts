import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Customer, { onDelete: 'CASCADE', nullable: false })
  customer: Customer;

  // 'YYYY-MM-DD'. Antes era timestamp e a busca por mês dependia do fuso do servidor.
  @Index()
  @Column({ type: 'date' })
  date: string;

  @Column()
  time: string;
}
