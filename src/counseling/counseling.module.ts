import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounselingData } from './entities/counseling-data.entity';
import { CounselingService } from './counseling.service';
import { CounselingController } from './counseling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CounselingData])],
  controllers: [CounselingController],
  providers: [CounselingService],
  exports: [CounselingService],
})
export class CounselingModule {}
