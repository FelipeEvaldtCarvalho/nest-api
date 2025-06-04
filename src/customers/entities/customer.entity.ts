import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  document: string;

  @Column({ type: 'date' })
  birthdate: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, (user) => user.customers, { onDelete: 'CASCADE' })
  user: User;
}
