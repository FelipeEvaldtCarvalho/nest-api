import { Customer } from '../../customers/entities/customer.entity';

export class CreateCounselingDataDto {
  customer: Customer;
  reason?: string;
  symptomsTime?: string;
  dailyLife?: string;
  hasHadTherapy?: string;
  expectations?: string;
}
