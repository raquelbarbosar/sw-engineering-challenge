/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { Locker } from '../../src/locker/entities/locker.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { RENT_SIZE, RENT_STATUS } from './interfaces/rent.interface';
import { Rent } from './entities/rent.entity';
import { UpdateRentDto } from './dto/update-rent.dto';

describe('RentController', () => {
  let controller: RentController;
  let service: RentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [
        {
          provide: RentService,
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

    controller = module.get<RentController>(RentController);
    service = module.get<RentService>(RentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new rent', async () => {
    const newRent: Rent = {
      id: '09c9cbae-d5b6-449d-874b-b796da853585',
      lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
      weight: 6,
      size: RENT_SIZE.L,
      status: RENT_STATUS.WAITING_PICKUP,
      createdAt: new Date(),
      locker: {
        id: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
        bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        status: 'CLOSED',
        isOccupied: true,
      } as Locker,
    };

    const rentDTO = {
      lockerId: '7c2746ba-ef27-4dd7-b165-2a4edb8b06ed',
      weight: 2,
      size: RENT_SIZE.M,
      status: RENT_STATUS.WAITING_PICKUP,
    } as CreateRentDto;

    jest.spyOn(service, 'create').mockResolvedValue(newRent);

    const result = await controller.create(rentDTO);
    expect(result).toEqual(newRent);
    expect(result.lockerId).toEqual(rentDTO.lockerId);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should get all rents', async () => {
    const rentList: Rent[] = [
      {
        id: '50be06a8-1dec-4b18-a23c-e98588207752',
        lockerId: null,
        weight: 5,
        size: 'M',
        status: 'CREATED',
        createdAt: '2026-03-20T17:41:03.021Z',
        droppedOffAt: null,
        pickedUpAt: null,
      },
      {
        id: '46f1b2a6-4e02-44e8-bfbf-3b031fbfb5b8',
        lockerId: '68caa124-f672-40aa-9cf1-a5b7cd7227aa',
        weight: 3,
        size: 'G',
        status: 'CREATED',
        createdAt: null,
        droppedOffAt: null,
        pickedUpAt: null,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(rentList);

    const result = await controller.findAll();
    expect(result.length).toEqual(rentList.length);
    expect(result[0]).toEqual(rentList[0]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should get a specific rent', async () => {
    const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';
    const rentReturned = {
      id: '50be06a8-1dec-4b18-a23c-e98588207752',
      lockerId: null,
      weight: 5,
      size: 'M',
      status: 'CREATED',
      createdAt: '2026-03-20T17:41:03.021Z',
      droppedOffAt: null,
      pickedUpAt: null,
    } as Rent;

    jest.spyOn(service, 'findOne').mockResolvedValue(rentReturned);

    const result = await controller.findOne(id);
    expect(result).toEqual(rentReturned);
    expect(id).toEqual(rentReturned.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a rents status', async () => {
    const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

    const rentUpdated: Rent = {
      id: '50be06a8-1dec-4b18-a23c-e98588207752',
      status: RENT_STATUS.DELIVERED,
      pickedUpAt: new Date(),
    };

    const rentUpdateDTO = {
      status: RENT_STATUS.DELIVERED,
    } as UpdateRentDto;

    jest.spyOn(service, 'updateStatus').mockResolvedValue(rentUpdated);

    const result = await controller.updateStatus(id, rentUpdateDTO);
    expect(result).toEqual(rentUpdated);
    expect(id).toEqual(rentUpdated.id);
    expect(service.updateStatus).toHaveBeenCalledTimes(1);
  });

  it('should delete a rent', async () => {
    const id: string = '50be06a8-1dec-4b18-a23c-e98588207752';

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
