/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RentService } from './rent.service';
import { Rent } from './entities/rent.entity';
import { LockerService } from 'src/locker/locker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRentDto } from './dto/create-rent.dto';
import { RENT_SIZE, RENT_STATUS } from './interfaces/rent.interface';
import { Locker } from 'src/locker/entities/locker.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateRentDto } from './dto/update-rent.dto';

describe('RentService', () => {
  let service: RentService;
  let repository: Repository<Rent>;
  let lockerService: LockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: getRepositoryToken(Rent),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: LockerService,
          useValue: {
            findOne: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RentService>(RentService);
    lockerService = module.get<LockerService>(LockerService);
    repository = module.get<Repository<Rent>>(getRepositoryToken(Rent));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should create a rent', () => {
    it('Success', async () => {
      const locker: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'OPEN',
        isOccupied: false,
      } as Locker;

      const lockerUpdated: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'CLOSED',
        isOccupied: true,
      } as Locker;

      const newRent: Rent = {
        id: '09c9cbae-d5b6-449d-874b-b796da853585',
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 6,
        size: RENT_SIZE.L,
        status: RENT_STATUS.WAITING_PICKUP,
        createdAt: new Date(),
        locker,
      };

      const rentDTO = {
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 2,
        size: RENT_SIZE.M,
        status: RENT_STATUS.WAITING_PICKUP,
      } as CreateRentDto;

      jest.spyOn(lockerService, 'findOne').mockResolvedValue(locker);
      jest
        .spyOn(lockerService, 'updateStatus')
        .mockResolvedValue(lockerUpdated);
      jest.spyOn(repository, 'save').mockResolvedValue(newRent);

      const result = await service.create(rentDTO);
      expect(result).toEqual(newRent);
      expect(lockerService.findOne).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const rentDTO = {
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 2,
        size: RENT_SIZE.M,
        status: RENT_STATUS.WAITING_PICKUP,
      } as CreateRentDto;

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new BadRequestException('query error'));

      await expect(service.create(rentDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('should get all rents', () => {
    it('Success', async () => {
      const rentList: Rent[] = [
        {
          id: '50be06a8-1dec-4b18-a23c-e98588207752',
          lockerId: null,
          weight: 5,
          size: RENT_SIZE.M,
          status: RENT_STATUS.CREATED,
          createdAt: '2026-03-20T17:41:03.021Z',
          droppedOffAt: null,
          pickedUpAt: null,
        },
        {
          id: '46f1b2a6-4e02-44e8-bfbf-3b031fbfb5b8',
          lockerId: '68caa124-f672-40aa-9cf1-a5b7cd7227aa',
          weight: 3,
          size: RENT_SIZE.L,
          status: RENT_STATUS.CREATED,
          createdAt: null,
          droppedOffAt: null,
          pickedUpAt: null,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(rentList);

      const result = await service.findAll();
      expect(result).toEqual(rentList);
      expect(result[0]).toEqual(rentList[0]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new NotFoundException('query error'));

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('should get a specific rent', () => {
    it('Success', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';
      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: null,
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.CREATED,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(rentReturned);

      const result = await service.findOne(id);
      expect(result).toEqual(rentReturned);
      expect(id).toEqual(rentReturned.id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      const id: string = '258fd61a-8104-473f-809f-422aa62a3418';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('should update rents status', () => {
    it('Success - WAITING_DROPOFF ', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

      const locker: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'OPEN',
        isOccupied: false,
      } as Locker;

      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.CREATED,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      };

      const rentUpdated: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        status: RENT_STATUS.WAITING_DROPOFF,
      };

      const rentUpdateDTO: UpdateRentDto = {
        status: RENT_STATUS.WAITING_DROPOFF,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);
      jest.spyOn(lockerService, 'findOne').mockResolvedValue(locker);
      jest.spyOn(repository, 'save').mockResolvedValue(rentUpdated);

      const result = await service.updateStatus(id, rentUpdateDTO);
      expect(result).toEqual(rentUpdated);
      expect(id).toEqual(rentUpdated.id);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('Success - WAITING_PICKUP ', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

      const locker: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'CLOSED',
        isOccupied: true,
      } as Locker;

      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.WAITING_DROPOFF,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      };

      const rentUpdated: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        status: RENT_STATUS.WAITING_PICKUP,
        droppedOffAt: new Date(),
      };

      const rentUpdateDTO: UpdateRentDto = {
        status: RENT_STATUS.WAITING_PICKUP,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);
      jest.spyOn(lockerService, 'findOne').mockResolvedValue(locker);
      jest.spyOn(repository, 'save').mockResolvedValue(rentUpdated);

      const result = await service.updateStatus(id, rentUpdateDTO);
      expect(result).toEqual(rentUpdated);
      expect(id).toEqual(rentUpdated.id);
      expect(result).toHaveProperty('droppedOffAt');
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('Success - DELIVERED ', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

      const locker: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'CLOSED',
        isOccupied: true,
      } as Locker;

      const lockerUpdated: Locker = {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'CLOSED',
        isOccupied: false,
      } as Locker;

      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.WAITING_PICKUP,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: '2026-03-21T13:22:03.021Z',
        pickedUpAt: null,
      };

      const rentUpdated: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        status: RENT_STATUS.DELIVERED,
        pickedUpAt: new Date(),
      };

      const rentUpdateDTO: UpdateRentDto = {
        status: RENT_STATUS.DELIVERED,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);
      jest.spyOn(lockerService, 'findOne').mockResolvedValue(locker);
      jest
        .spyOn(lockerService, 'updateStatus')
        .mockResolvedValue(lockerUpdated);
      jest.spyOn(repository, 'save').mockResolvedValue(rentUpdated);

      const result = await service.updateStatus(id, rentUpdateDTO);
      expect(result).toEqual(rentUpdated);
      expect(id).toEqual(rentUpdated.id);
      expect(result).toHaveProperty('pickedUpAt');
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e9858820775';
      const rentUpdateDTO: UpdateRentDto = {
        status: RENT_STATUS.WAITING_DROPOFF,
      };

      await expect(service.updateStatus(id, rentUpdateDTO)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('BadRequestException - Locker ID is null', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e9858820775';

      const rentUpdateDTO: UpdateRentDto = {
        status: RENT_STATUS.WAITING_DROPOFF,
      };

      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: null,
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.CREATED,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);

      try {
        await service.updateStatus(id, rentUpdateDTO);
      } catch (err) {
        expect(err.message).toEqual('Error finding rent: locker id is null!');
      }
    });
  });

  describe('should delete a rent', () => {
    it('Success', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

      const rentReturned: Rent = {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: null,
        weight: 5,
        size: RENT_SIZE.M,
        status: RENT_STATUS.CREATED,
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      };

      const repositoryResponse = {
        raw: [],
        affected: 1,
      };

      const serviceResponse = {
        affected: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);
      jest.spyOn(repository, 'delete').mockResolvedValue(repositoryResponse);

      const result = await service.delete(id);
      expect(result).toEqual(serviceResponse);
      expect(repository.delete).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const id: string = '50be06a8-1dec-4b18-a23c-e9858820775';
      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
    });
  });
});
