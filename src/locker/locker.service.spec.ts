/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { LockerService } from './locker.service';
import { Locker } from './entities/locker.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloqService } from '../bloq/bloq.service';
import { Bloq } from 'src/bloq/entities/bloq.entity';
import { LOCKER_STATUS } from './interfaces/locker.interface';
import { CreateLockerDto } from './dto/create-locker.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateStatusLockerDto } from './dto/update-status-locker.dto';

describe('LockerService', () => {
  let service: LockerService;
  let repository: Repository<Locker>;
  let bloqService: BloqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockerService,
        {
          provide: getRepositoryToken(Locker),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: BloqService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LockerService>(LockerService);
    bloqService = module.get<BloqService>(BloqService);
    repository = module.get<Repository<Locker>>(getRepositoryToken(Locker));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should create a locker', () => {
    it('Success', async () => {
      const bloq = {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq;

      const newLocker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: LOCKER_STATUS.CLOSED,
        isOccupied: true,
        bloq,
      } as Locker;

      const lockerDTO = {
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: LOCKER_STATUS.CLOSED,
        isOccupied: true,
      } as CreateLockerDto;

      jest.spyOn(bloqService, 'findOne').mockResolvedValue(bloq);
      jest.spyOn(repository, 'save').mockResolvedValue(newLocker);

      const result = await service.create(lockerDTO);
      expect(result).toEqual(newLocker);
      expect(bloqService.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const lockerDTO = {
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: LOCKER_STATUS.CLOSED,
        isOccupied: true,
      } as CreateLockerDto;

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new BadRequestException('query error'));

      await expect(service.create(lockerDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('should get all lockers', () => {
    it('Success', async () => {
      const lockerList = [
        {
          id: '258fd61a-8104-473f-809f-422aa62a3419',
          bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
          status: 'OPEN',
          isOccupied: false,
        },
        {
          id: '68caa124-f672-40aa-9cf1-a5b7cd7227aa',
          bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
          status: 'CLOSED',
          isOccupied: true,
        },
      ] as Locker[];

      jest.spyOn(repository, 'find').mockResolvedValue(lockerList);

      const result = await service.findAll();
      expect(result).toEqual(lockerList);
      expect(result[0]).toEqual(lockerList[0]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new NotFoundException('query error'));

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('should get a specific locker', () => {
    it('Success', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3419';
      const lockerReturned = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'OPEN',
        isOccupied: false,
      } as Locker;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(lockerReturned);

      const result = await service.findOne(id);
      expect(result).toEqual(lockerReturned);
      expect(id).toEqual(lockerReturned.id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3418';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('should update lockers status', () => {
    it('Success - OPEN -> CLOSED ', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3419';

      const lockerReturned = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'OPEN',
        isOccupied: false,
      } as Locker;

      const lockerUpdated = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'CLOSED',
        isOccupied: true,
      } as Locker;

      const lockerUpdateDTO = {
        status: LOCKER_STATUS.CLOSED,
        isOccupied: true,
      } as UpdateStatusLockerDto;

      jest.spyOn(service, 'findOne').mockResolvedValue(lockerReturned);
      jest.spyOn(repository, 'save').mockResolvedValue(lockerUpdated);

      const result = await service.updateStatus(id, lockerUpdateDTO);
      expect(result).toEqual(lockerUpdated);
      expect(id).toEqual(lockerUpdated.id);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('Success - CLOSED -> OPEN ', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3419';

      const lockerReturned = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'CLOSED',
        isOccupied: false,
      } as Locker;

      const lockerUpdated = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'OPEN',
        isOccupied: true,
      } as Locker;

      const lockerUpdateDTO = {
        status: LOCKER_STATUS.OPEN,
        isOccupied: true,
      } as UpdateStatusLockerDto;

      jest.spyOn(service, 'findOne').mockResolvedValue(lockerReturned);
      jest.spyOn(repository, 'save').mockResolvedValue(lockerUpdated);

      const result = await service.updateStatus(id, lockerUpdateDTO);
      expect(result).toEqual(lockerUpdated);
      expect(id).toEqual(lockerUpdated.id);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3414';
      const lockerUpdateDTO = {
        status: LOCKER_STATUS.CLOSED,
        isOccupied: true,
      } as UpdateStatusLockerDto;

      await expect(service.updateStatus(id, lockerUpdateDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('should delete a locker', () => {
    it('Success', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3419';

      const lockerReturned = {
        id: '258fd61a-8104-473f-809f-422aa62a3419',
        bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
        status: 'OPEN',
        isOccupied: false,
      } as Locker;

      const repositoryResponse = {
        raw: [],
        affected: 1,
      };

      const serviceResponse = {
        affected: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(lockerReturned);
      jest.spyOn(repository, 'delete').mockResolvedValue(repositoryResponse);

      const result = await service.delete(id);
      expect(result).toEqual(serviceResponse);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';
      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
    });
  });
});
