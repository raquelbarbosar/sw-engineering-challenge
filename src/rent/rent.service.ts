/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Rent } from './entities/rent.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LockerService } from '../locker/locker.service';
import { RENT_STATUS } from './interfaces/rent.interface';
import { LOCKER_STATUS } from 'src/locker/interfaces/locker.interface';
import { UpdateStatusLockerDto } from 'src/locker/dto/update-status-locker.dto';

@Injectable()
export class RentService {
  private readonly logger = new Logger(RentService.name);

  constructor(
    @InjectRepository(Rent) private rentRepository: Repository<Rent>,
    private lockerService: LockerService,
  ) {}

  async create(createRentDto: CreateRentDto): Promise<Rent> {
    try {
      const locker = await this.lockerService.findOne(createRentDto.lockerId);

      const newRent = new Rent();
      newRent.lockerId = locker.id;
      newRent.locker = locker;
      newRent.weight = createRentDto.weight;
      newRent.size = createRentDto.size;
      newRent.status = createRentDto.status ?? RENT_STATUS.CREATED;

      await this.lockerService.updateStatus(locker.id, {
        status: LOCKER_STATUS.CLOSED,
      } as UpdateStatusLockerDto);
      const rent = await this.rentRepository.save(newRent);

      return rent;
    } catch (err) {
      const errMessage = `Error creating rent: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  findAll(): Promise<Rent[]> {
    try {
      return this.rentRepository.find();
    } catch (err) {
      const errMessage = `Error finding all rents: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async findOne(id: string): Promise<Rent> {
    try {
      const rent = await this.rentRepository.findOneBy({ id });

      if (!rent) {
        throw new Error('rent not found!');
      }

      return rent;
    } catch (err) {
      const errMessage = `Error finding rent: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async updateStatus(id: string, updateRentDto: UpdateRentDto) {
    try {
      const rent = await this.findOne(id);
      let updatedRent: Rent = new Rent();

      if (!rent.lockerId) {
        throw new Error('locker id is null!');
      }

      const locker = await this.lockerService.findOne(rent.lockerId);

      if (updateRentDto.status === RENT_STATUS.WAITING_DROPOFF) {
        updatedRent = await this.rentRepository.save({
          id,
          status: updateRentDto.status,
        });
      }

      if (updateRentDto.status === RENT_STATUS.WAITING_PICKUP) {
        updatedRent = await this.rentRepository.save({
          id,
          status: updateRentDto.status,
          droppedOffAt: new Date(),
        });
      }

      if (updateRentDto.status === RENT_STATUS.DELIVERED) {
        await this.lockerService.updateStatus(locker.id, {
          status: LOCKER_STATUS.CLOSED,
          isOccupied: false,
        } as UpdateStatusLockerDto);

        updatedRent = await this.rentRepository.save({
          id,
          status: updateRentDto.status,
          pickedUpAt: new Date(),
        });
      }

      return updatedRent;
    } catch (err) {
      const errMessage = `Error finding rent: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  async delete(id: string) {
    try {
      const rent = await this.findOne(id);
      const result = await this.rentRepository.delete({ id: rent.id });
      return { affected: result.affected };
    } catch (err) {
      const errMessage = `Error deleting rent: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }
}
