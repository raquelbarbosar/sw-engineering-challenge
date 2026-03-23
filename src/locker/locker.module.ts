import { Module } from '@nestjs/common';
import { LockerService } from './locker.service';
import { LockerController } from './locker.controller';
import { Locker } from './entities/locker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqModule } from 'src/bloq/bloq.module';

@Module({
  imports: [BloqModule, TypeOrmModule.forFeature([Locker])],
  controllers: [LockerController],
  providers: [LockerService],
  exports: [LockerService],
})
export class LockerModule {}
