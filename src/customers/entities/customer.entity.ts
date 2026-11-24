import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// O mesmo CPF pode existir para operadores diferentes, mas não duas vezes para o mesmo operador.
@Entity()
@Unique('UQ_customer_user_document', ['user', 'document'])
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  document: string;

  @Column({ type: 'date', nullable: true })
  birthdate: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Index()
  @ManyToOne(() => User, (user) => user.customers, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;
}
