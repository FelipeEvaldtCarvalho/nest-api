import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChronologicalCycle } from './entities/chronological-cycle.entity';
import { Customer } from '../customers/entities/customer.entity';
import { ChronologicalCycleService } from './chronological-cycle.service';
import { ChronologicalCycleController } from './chronological-cycle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChronologicalCycle, Customer])],
  controllers: [ChronologicalCycleController],
  providers: [ChronologicalCycleService],
  exports: [ChronologicalCycleService],
})
export class ChronologicalCycleModule {}
