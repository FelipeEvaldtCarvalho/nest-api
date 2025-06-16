import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CounselingModule } from './counseling/counseling.module';
import { ChronologicalCycleModule } from './chronological-cycle/chronological-cycle.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'nest',
      password: 'nestpass',
      database: 'nestdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // USAR TRUE SOMENTE EM DESENVOLVIMENTO
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    DashboardModule,
    CounselingModule,
    ChronologicalCycleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
