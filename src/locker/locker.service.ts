/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateLockerDto } from './dto/create-locker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Locker } from './entities/locker.entity';
import { Repository } from 'typeorm';
import { LOCKER_STATUS } from './interfaces/locker.interface';
import { BloqService } from 'src/bloq/bloq.service';
import { UpdateStatusLockerDto } from './dto/update-status-locker.dto';

@Injectable()
export class LockerService {
  private readonly logger = new Logger(LockerService.name);

  constructor(
    @InjectRepository(Locker) private lockerRepository: Repository<Locker>,
    private bloqService: BloqService,
  ) {}

  async create(createLockerDto: CreateLockerDto): Promise<Locker> {
    //const newLocker = createLockerEntity(createLockerDto);
    try {
      const bloq = await this.bloqService.findOne(createLockerDto.bloqId);

      if (!bloq) {
        throw new Error('bloq not found!');
      }

      const newLocker = new Locker();
      newLocker.bloqId = createLockerDto.bloqId;
      newLocker.bloq = bloq;
      newLocker.status = createLockerDto.status ?? LOCKER_STATUS.OPEN;
      newLocker.isOccupied = createLockerDto.isOccupied ?? false;

      return await this.lockerRepository.save(newLocker);
    } catch (err) {
      const errMessage = `Error creating locker: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  findAll(): Promise<Locker[]> {
    try {
      return this.lockerRepository.find();
    } catch (err) {
      const errMessage = `Error finding all lockers: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async findOne(id: string): Promise<Locker> {
    try {
      const locker = await this.lockerRepository.findOneBy({ id });

      if (!locker) {
        throw new Error('locker not found!');
      }

      return locker;
    } catch (err) {
      const errMessage = `Error finding locker: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async updateStatus(
    id: string,
    updateStatusLockerDto: UpdateStatusLockerDto,
  ): Promise<Locker> {
    try {
      let isOccupied = updateStatusLockerDto.isOccupied ?? true;

      await this.findOne(id);

      if (updateStatusLockerDto.status === LOCKER_STATUS.OPEN) {
        isOccupied = false;
      }

      return await this.lockerRepository.save({
        id,
        status: updateStatusLockerDto.status,
        isOccupied,
      });
    } catch (err) {
      const errMessage = `Error creating locker: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  async delete(id: string) {
    try {
      const locker = await this.findOne(id);
      const result = await this.lockerRepository.delete({ id: locker.id });
      return { affected: result.affected };
    } catch (err) {
      const errMessage = `Error deleting locker: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }
}
