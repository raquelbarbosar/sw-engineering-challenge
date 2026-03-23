import { Locker } from 'src/locker/entities/locker.entity';
import { IBloq } from '../interfaces/bloq.interface';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bloq implements IBloq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    this.id = crypto.randomUUID();
  }

  @Column()
  title: string;

  @Column()
  address: string;

  @OneToMany(() => Locker, (locker) => locker.bloq)
  lockers: Locker[];
}
