import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Customer, User])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
