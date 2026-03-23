import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent } from './entities/rent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LockerModule } from 'src/locker/locker.module';

@Module({
  imports: [LockerModule, TypeOrmModule.forFeature([Rent])],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
