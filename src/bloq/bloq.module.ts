import { Module } from '@nestjs/common';
import { BloqService } from './bloq.service';
import { BloqController } from './bloq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bloq } from './entities/bloq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bloq])],
  controllers: [BloqController],
  providers: [BloqService],
  exports: [BloqService],
})
export class BloqModule {}
