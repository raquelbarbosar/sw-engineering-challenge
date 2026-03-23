/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBloqDto } from './dto/create-bloq.dto';
import { UpdateBloqDto } from './dto/update-bloq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bloq } from './entities/bloq.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BloqService {
  private readonly logger = new Logger(BloqService.name);

  constructor(
    @InjectRepository(Bloq) private bloqRepository: Repository<Bloq>,
  ) {}

  async create(createBloqDto: CreateBloqDto): Promise<Bloq> {
    try {
      const newBloq = new Bloq();
      newBloq.address = createBloqDto.address;
      newBloq.title = createBloqDto.title;
      const bloq = await this.bloqRepository.save(newBloq);
      return bloq;
    } catch (err) {
      const errMessage = `Error creating bloq: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  findAll(): Promise<Bloq[]> {
    try {
      return this.bloqRepository.find();
    } catch (err) {
      const errMessage = `Error finding all bloq: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async findOne(id: string): Promise<Bloq> {
    try {
      const bloq = await this.bloqRepository.findOneBy({ id });

      if (!bloq) {
        throw new Error('bloq not found!');
      }

      return bloq;
    } catch (err) {
      const errMessage = `Error finding bloq: ${err.message}`;
      this.logger.log(errMessage);
      throw new NotFoundException(errMessage);
    }
  }

  async update(id: string, updateBloqDto: UpdateBloqDto) {
    try {
      await this.findOne(id);

      return await this.bloqRepository.save({
        id,
        ...updateBloqDto,
      });
    } catch (err) {
      const errMessage = `Error updating bloq: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }

  async delete(id: string) {
    try {
      const bloq = await this.findOne(id);
      const result = await this.bloqRepository.delete({ id: bloq.id });
      return { affected: result.affected };
    } catch (err) {
      const errMessage = `Error deleting bloq: ${err.message}`;
      this.logger.log(errMessage);
      throw new BadRequestException(errMessage);
    }
  }
}
