/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import supertest from 'supertest';
import { Locker } from '../src/locker/entities/locker.entity';
import { LockerModule } from '../src/locker/locker.module';
import { Rent } from 'src/rent/entities/rent.entity';
import { RentModule } from 'src/rent/rent.module';
import { CreateRentDto } from 'src/rent/dto/create-rent.dto';
import { RENT_SIZE, RENT_STATUS } from 'src/rent/interfaces/rent.interface';
import { UpdateRentDto } from 'src/rent/dto/update-rent.dto';

let app: INestApplication;
let repository: Repository<Rent>;
let rentId: string;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      RentModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'pg123',
        database: 'e2e_tests',
        entities: ['./**/*.entity.ts'],
        synchronize: false,
      }),
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();
  repository = module.get('RentRepository');
});

afterAll(async () => {
  rentId = '';
  await app.close();
});

describe('GET /rent', () => {
  it('should return an array of rents', async () => {
    const response = await supertest
      .agent(app.getHttpServer())
      .get('/rent')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toEqual({
      createdAt: '2026-03-23T09:43:50.231Z',
      droppedOffAt: null,
      id: '50be06a8-1dec-4b18-a23c-e98588207752',
      lockerId: null,
      pickedUpAt: null,
      size: 'M',
      status: 'CREATED',
      weight: 5,
    });
  });
});

describe('POST /rent', () => {
  it('should create a new rent', async () => {
    const rentDTO = {
      lockerId: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
      weight: 2,
      size: RENT_SIZE.M,
      status: RENT_STATUS.WAITING_PICKUP,
    } as CreateRentDto;

    const response = await supertest
      .agent(app.getHttpServer())
      .post('/rent')
      .send(rentDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body.lockerId).toEqual(rentDTO.lockerId);
    expect(response.body.weight).toEqual(rentDTO.weight);
    expect(response.body.size).toEqual(rentDTO.size);
    expect(response.body.status).toEqual(rentDTO.status);

    rentId = response.body.id;
  });
});

describe('GET /rent/:id', () => {
  it('should get a specific rent', async () => {
    const path = `/rent/${rentId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .get(path)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.id).toEqual(rentId);
    expect(response.body.lockerId).toEqual(
      '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
    );
    expect(response.body.weight).toEqual(2);
    expect(response.body.size).toEqual(RENT_SIZE.M);
    expect(response.body.status).toEqual(RENT_STATUS.WAITING_PICKUP);
  });
});

describe('PATCH /rent/:id', () => {
  it('should update a specific rent', async () => {
    const rentUpdateDTO: UpdateRentDto = {
      status: RENT_STATUS.DELIVERED,
    };

    const path = `/rent/${rentId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .patch(path)
      .send(rentUpdateDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.id).toEqual(rentId);
    expect(response.body.status).toEqual(rentUpdateDTO.status);
  });
});

describe('DELETE /rent/:id', () => {
  it('should delete a rent', async () => {
    const path = `/rent/${rentId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .delete(path)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual({
      affected: 1,
    });
  });
});
