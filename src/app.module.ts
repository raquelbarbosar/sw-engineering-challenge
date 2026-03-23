import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqModule } from './bloq/bloq.module';
import { LockerModule } from './locker/locker.module';
import { RentModule } from './rent/rent.module';
import { Bloq } from './bloq/entities/bloq.entity';
import { Locker } from './locker/entities/locker.entity';
import { Rent } from './rent/entities/rent.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pg123',
      database: 'bloqit',
      entities: [Bloq, Locker, Rent],
      retryAttempts: 5,
      logging: true,
    }),
    BloqModule,
    LockerModule,
    RentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
