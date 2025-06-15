import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { CounselingModule } from '../counseling/counseling.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, User]), CounselingModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
