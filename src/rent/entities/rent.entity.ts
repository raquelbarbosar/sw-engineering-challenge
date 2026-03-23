import { Locker } from 'src/locker/entities/locker.entity';
import { IRent, RENT_SIZE, RENT_STATUS } from '../interfaces/rent.interface';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Rent implements IRent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    this.id = crypto.randomUUID();
  }

  @Column({ name: 'lockerid' })
  lockerId: string;

  @Column()
  weight: number;

  @Column({ type: 'enum', enum: RENT_SIZE, default: RENT_SIZE.S })
  size: RENT_SIZE;

  @Column({ type: 'enum', enum: RENT_STATUS, default: RENT_STATUS.CREATED })
  status: RENT_STATUS;

  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @BeforeInsert()
  updateDate() {
    this.createdAt = new Date();
  }

  @Column({ name: 'droppedoffat' })
  droppedOffAt: Date;

  @Column({ name: 'pickedupat' })
  pickedUpAt: Date;

  @OneToOne(() => Locker, (locker) => locker.rent)
  @JoinColumn({ name: 'lockerid' })
  locker: Locker;
}
