import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class DashboardService {
  constructor(private readonly customersService: CustomersService) {}

  async getDashboardData(user: any) {
    const allCustomers = await this.customersService.findAll(user);
    return {
      customers: allCustomers.length,
    };
  }
}
