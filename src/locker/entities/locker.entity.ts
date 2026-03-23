import { Bloq } from '../../bloq/entities/bloq.entity';
import { ILocker, LOCKER_STATUS } from '../interfaces/locker.interface';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rent } from '../../rent/entities/rent.entity';

@Entity()
export class Locker implements ILocker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    this.id = crypto.randomUUID();
  }

  @Column({ name: 'bloqid' })
  bloqId: string;

  @Column({ type: 'enum', enum: LOCKER_STATUS, default: LOCKER_STATUS.OPEN })
  status: LOCKER_STATUS;

  @Column({ name: 'isoccupied', default: false })
  isOccupied: boolean;

  @ManyToOne(() => Bloq, (bloq) => bloq.lockers)
  @JoinColumn({ name: 'bloqid' })
  bloq: Bloq;

  @OneToOne(() => Rent, (rent) => rent.locker)
  rent: Rent;
}
