/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import supertest from 'supertest';
import { Locker } from '../src/locker/entities/locker.entity';
import { LockerModule } from '../src/locker/locker.module';
import { CreateLockerDto } from '../src/locker/dto/create-locker.dto';
import { LOCKER_STATUS } from '../src/locker/interfaces/locker.interface';
import { UpdateStatusLockerDto } from '../src/locker/dto/update-status-locker.dto';

let app: INestApplication;
let repository: Repository<Locker>;
let lockerId: string;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      LockerModule,
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
  repository = module.get('LockerRepository');
});

afterAll(async () => {
  lockerId = '';
  await app.close();
});

describe('GET /locker', () => {
  it('should return an array of lockers', async () => {
    const response = await supertest
      .agent(app.getHttpServer())
      .get('/locker')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toEqual({
      bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      id: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
      isOccupied: true,
      status: 'CLOSED',
    });
  });
});

describe('POST /locker', () => {
  it('should create a new locker', async () => {
    const lockerDTO = {
      bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      status: LOCKER_STATUS.OPEN,
      isOccupied: false,
    } as CreateLockerDto;

    const response = await supertest
      .agent(app.getHttpServer())
      .post('/locker')
      .send(lockerDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body.bloqId).toEqual(lockerDTO.bloqId);
    expect(response.body.status).toEqual(lockerDTO.status);
    expect(response.body.isOccupied).toEqual(lockerDTO.isOccupied);

    lockerId = response.body.id;
  });
});

describe('GET /locker/:id', () => {
  it('should get a specific locker', async () => {
    const path = `/locker/${lockerId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .get(path)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.id).toEqual(lockerId);
    expect(response.body.bloqId).toEqual(
      'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
    );
    expect(response.body.status).toEqual(LOCKER_STATUS.OPEN);
    expect(response.body.isOccupied).toEqual(false);
  });
});

describe('PATCH /locker/:id', () => {
  it('should update a specific locker', async () => {
    const lockerUpdateDTO = {
      status: LOCKER_STATUS.CLOSED,
      isOccupied: true,
    } as UpdateStatusLockerDto;

    const path = `/locker/${lockerId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .patch(path)
      .send(lockerUpdateDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body.id).toEqual(lockerId);
    expect(response.body.status).toEqual(lockerUpdateDTO.status);
    expect(response.body.isOccupied).toEqual(lockerUpdateDTO.isOccupied);
  });
});

describe('DELETE /locker/:id', () => {
  it('should delete a locker', async () => {
    const path = `/locker/${lockerId}`;

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
