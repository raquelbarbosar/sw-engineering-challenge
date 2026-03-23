/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BloqService } from './bloq.service';
import { Repository } from 'typeorm';
import { Bloq } from './entities/bloq.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBloqDto } from './dto/create-bloq.dto';
import { UpdateBloqDto } from './dto/update-bloq.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BloqService', () => {
  let service: BloqService;
  let repository: Repository<Bloq>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BloqService,
        {
          provide: getRepositoryToken(Bloq),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BloqService>(BloqService);
    repository = module.get<Repository<Bloq>>(getRepositoryToken(Bloq));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should create a bloq', () => {
    it('Success', async () => {
      const newBloq = {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq;

      const bloqDTO = {
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as CreateBloqDto;

      jest.spyOn(repository, 'save').mockResolvedValue(newBloq);

      const result = await service.create(bloqDTO);
      expect(result).toEqual(newBloq);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const bloqDTO = {
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as CreateBloqDto;

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new BadRequestException('query error'));

      await expect(service.create(bloqDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('should get all bloq', () => {
    it('Success', async () => {
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

      jest.spyOn(repository, 'find').mockResolvedValue(bloqsList);

      const result = await service.findAll();
      expect(result).toEqual(bloqsList);
      expect(result[0]).toEqual(bloqsList[0]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      jest
        .spyOn(repository, 'find')
        .mockRejectedValue(new NotFoundException('query error'));

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('should get a specific bloq', () => {
    it('Success', async () => {
      const id: string = 'c3ee858c-f3d8-45a3-803d-e080649bbb6f';
      const bloqReturned = {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(bloqReturned);

      const result = await service.findOne(id);
      expect(result).toEqual(bloqReturned);
      expect(id).toEqual(bloqReturned.id);
      expect(repository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('NotFoundException', async () => {
      const id: string = 'c3ee858c-f3d8-45a3-803d-e080649bbb6f';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('should update a bloq', () => {
    it('Success', async () => {
      const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';

      const bloqReturned = {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq;

      const bloqUpdated = {
        id: 'c468152c-b875-45ed-add7-d2ddf023042c',
        title: 'Glicinias Plazassss',
        address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Italia',
      } as Bloq;

      const bloqUpdateDTO = {
        title: 'Glicinias Plazassss',
        address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Italia',
      } as UpdateBloqDto;

      jest.spyOn(service, 'findOne').mockResolvedValue(bloqReturned);
      jest.spyOn(repository, 'save').mockResolvedValue(bloqUpdated);

      const result = await service.update(id, bloqUpdateDTO);
      expect(result).toEqual(bloqUpdated);
      expect(id).toEqual(bloqUpdated.id);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('BadRequestException', async () => {
      const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';
      const bloqUpdateDTO = {
        title: 'Glicinias Plazassss',
        address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Italia',
      } as UpdateBloqDto;

      await expect(service.update(id, bloqUpdateDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('should delete a bloq', () => {
    it('Success', async () => {
      const id: string = 'c468152c-b875-45ed-add7-d2ddf023042c';

      const bloqReturned = {
        id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
        title: 'Luitton Vouis Champs Elysées',
        address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      } as Bloq;

      const repositoryResponse = {
        raw: [],
        affected: 1,
      };

      const serviceResponse = {
        affected: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(bloqReturned);
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
