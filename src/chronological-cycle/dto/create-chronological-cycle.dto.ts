import { Customer } from '../../customers/entities/customer.entity';

export class CreateChronologicalCycleDto {
  customer: Customer;
  date: Date;
  cycle?: string;
  fase?: string;
  emotionalScale?: string;
  physicalScale?: string;
  order?: number;
}
