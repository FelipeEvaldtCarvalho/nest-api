import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('chronological_cycle')
export class ChronologicalCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' })
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
