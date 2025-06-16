import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity()
export class ChronologicalCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  // Data
  @Column({ type: 'date' })
  date: Date;

  // Ciclo
  @Column({ type: 'text', nullable: true })
  cycle: string;

  // Fase
  @Column({ type: 'text', nullable: true })
  fase: string;

  // Escala emocional
  @Column({ type: 'text', nullable: true })
  emotionalScale: string;

  // Escala física
  @Column({ type: 'text', nullable: true })
  physicalScale: string;

  // Ordem
  @Column({ type: 'integer' })
  order: number;
}
