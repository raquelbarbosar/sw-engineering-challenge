/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { LockerController } from './locker.controller';
import { LockerService } from './locker.service';
import { Locker } from './entities/locker.entity';
import { CreateLockerDto } from './dto/create-locker.dto';
import { LOCKER_STATUS } from './interfaces/locker.interface';
import { Bloq } from 'src/bloq/entities/bloq.entity';
import { UpdateStatusLockerDto } from './dto/update-status-locker.dto';

describe('LockerController', () => {
  let controller: LockerController;
  let service: LockerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LockerController],
      providers: [
        {
          provide: LockerService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateStatus: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LockerController>(LockerController);
    service = module.get<LockerService>(LockerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new locker', async () => {
    const newLocker = {
      id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
      bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      status: LOCKER_STATUS.CLOSED,
      isOccupied: true,
      bloq: {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq,
    } as Locker;

    const lockerDTO = {
      bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      status: LOCKER_STATUS.CLOSED,
      isOccupied: true,
    } as CreateLockerDto;

    jest.spyOn(service, 'create').mockResolvedValue(newLocker);

    const result = await controller.create(lockerDTO);
    expect(result).toEqual(newLocker);
    expect(result.bloqId).toEqual(lockerDTO.bloqId);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should get all lockers', async () => {
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

    jest.spyOn(service, 'findAll').mockResolvedValue(lockerList);

    const result = await controller.findAll();
    expect(result.length).toEqual(lockerList.length);
    expect(result[0]).toEqual(lockerList[0]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should get a specific locker', async () => {
    const id: string = '258fd61a-8104-473f-809f-422aa62a3419';
    const lockerReturned = {
      id: '258fd61a-8104-473f-809f-422aa62a3419',
      bloqId: 'cbeb388e-aef2-49dd-9e0a-345fc10922c5',
      status: 'OPEN',
      isOccupied: false,
    } as Locker;

    jest.spyOn(service, 'findOne').mockResolvedValue(lockerReturned);

    const result = await controller.findOne(id);
    expect(result).toEqual(lockerReturned);
    expect(id).toEqual(lockerReturned.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a lockers status', async () => {
    const id: string = '258fd61a-8104-473f-809f-422aa62a3419';

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

    jest.spyOn(service, 'updateStatus').mockResolvedValue(lockerUpdated);

    const result = await controller.updateStatus(id, lockerUpdateDTO);
    expect(result).toEqual(lockerUpdated);
    expect(id).toEqual(lockerUpdated.id);
    expect(service.updateStatus).toHaveBeenCalledTimes(1);
  });

  it('should delete a locker', async () => {
    const id: string = '258fd61a-8104-473f-809f-422aa62a3419';

    const mockResponse = {
      affected: 1,
    };

    jest.spyOn(service, 'delete').mockResolvedValue(mockResponse);

    const result = await controller.delete(id);
    expect(result?.affected).toEqual(1);
    expect(result).toEqual(mockResponse);
    expect(service.delete).toHaveBeenCalledTimes(1);
  });
});
