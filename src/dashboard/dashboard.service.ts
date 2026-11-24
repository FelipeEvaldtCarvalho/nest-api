import { Injectable } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { AuthUser } from '../auth/auth-user';

@Injectable()
export class DashboardService {
  constructor(private readonly customersService: CustomersService) {}

  async getDashboardData(user: AuthUser) {
    return {
      customers: await this.customersService.countByUser(user),
    };
  }
}
