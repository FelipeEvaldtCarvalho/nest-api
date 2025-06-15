import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity()
export class CounselingData {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;

  // Motivo
  @Column({ type: 'text', nullable: true })
  reason?: string;

  // Tempo de sintomas
  @Column({ type: 'text', nullable: true })
  symptomsTime?: string;

  // Como isso feta no seu dia a dia
  @Column({ type: 'text', nullable: true })
  dailyLife?: string;

  // Ja fez terapia?
  @Column({ type: 'text', nullable: true })
  hasHadTherapy?: string;

  // O que espera com a terapia TRG?
  @Column({ type: 'text', nullable: true })
  expectations?: string;
}
