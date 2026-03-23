/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BloqController } from './bloq.controller';
import { BloqService } from './bloq.service';
import { Bloq } from './entities/bloq.entity';
import { CreateBloqDto } from './dto/create-bloq.dto';
import { UpdateBloqDto } from './dto/update-bloq.dto';

describe('BloqController', () => {
  let controller: BloqController;
  let service: BloqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloqController],
      providers: [
        {
          provide: BloqService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BloqController>(BloqController);
    service = module.get<BloqService>(BloqService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new bloq', async () => {
    const newBloq = {
      id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      title: 'Luitton Vouis Champs Elysées',
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
    } as Bloq;

    const bloqDTO = {
      title: 'Luitton Vouis Champs Elysées',
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
    } as CreateBloqDto;

    jest.spyOn(service, 'create').mockResolvedValue(newBloq);

    const result = await controller.create(bloqDTO);
    expect(result).toEqual(newBloq);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('should get all bloqs', async () => {
    const bloqsList = [
      {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      },
      {
        id: '484e01be-1570-4ac1-a2a9-02aad3acc54e',
        title: 'Riod Eixample',
        address: "Pg. de Gràcia, 74, L'Eixample, 08008 Barcelona, Spain",
      },
    ] as Bloq[];

    jest.spyOn(service, 'findAll').mockResolvedValue(bloqsList);

    const result = await controller.findAll();
    expect(result.length).toEqual(bloqsList.length);
    expect(result[0]).toEqual(bloqsList[0]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('should get a specific bloq', async () => {
    const id: string = 'c3ee858c-f3d8-45a3-803d-e080649bbb6f';
    const bloqReturned = {
      id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      title: 'Luitton Vouis Champs Elysées',
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
    } as Bloq;

    jest.spyOn(service, 'findOne').mockResolvedValue(bloqReturned);

    const result = await controller.findOne(id);
    expect(result).toEqual(bloqReturned);
    expect(id).toEqual(bloqReturned.id);
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('should update a bloq', async () => {
    const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';

    const bloqUpdated = {
      id: 'c468152c-b875-45ed-add7-d2ddf023042c',
      title: 'Glicinias Plazassss',
      address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Italia',
    } as Bloq;

    const bloqUpdateDTO = {
      title: 'Glicinias Plazassss',
      address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Italia',
    } as UpdateBloqDto;

    jest.spyOn(service, 'update').mockResolvedValue(bloqUpdated);

    const result = await controller.update(id, bloqUpdateDTO);
    expect(result).toEqual(bloqUpdated);
    expect(id).toEqual(bloqUpdated.id);
    expect(service.update).toHaveBeenCalledTimes(1);
  });

  it('should delete a bloq', async () => {
    const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';

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
