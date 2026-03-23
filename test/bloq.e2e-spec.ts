/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqModule } from '../src/bloq/bloq.module';
import { Repository } from 'typeorm';
import { Bloq } from '../src/bloq/entities/bloq.entity';
import supertest from 'supertest';
import { CreateBloqDto } from '../src/bloq/dto/create-bloq.dto';
import { UpdateBloqDto } from '../src/bloq/dto/update-bloq.dto';

let app: INestApplication;
let repository: Repository<Bloq>;
let bloqId: string;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      BloqModule,
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
  repository = module.get('BloqRepository');
});

afterAll(async () => {
  bloqId = '';
  await app.close();
});

describe('GET /bloq', () => {
  it('should return an array of bloqs', async () => {
    const response = await supertest
      .agent(app.getHttpServer())
      .get('/bloq')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toEqual({
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      id: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
      title: 'Luitton Vouis Champs Elysées',
    });
  });
});

describe('POST /bloq', () => {
  it('should create a new bloq', async () => {
    const bloqDTO = {
      title: 'Luitton Vouis Champs Elysées',
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
    } as CreateBloqDto;

    const response = await supertest
      .agent(app.getHttpServer())
      .post('/bloq')
      .send(bloqDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.statusCode).toEqual(HttpStatus.CREATED);
    expect(response.body).toEqual({
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      id: expect.any(String),
      title: 'Luitton Vouis Champs Elysées',
    });

    bloqId = response.body.id;
  });
});

describe('GET /bloq/:id', () => {
  it('should get a specific bloq', async () => {
    const path = `/bloq/${bloqId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .get(path)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual({
      address: '101 Av. des Champs-Élysées, 75008 Paris, France',
      id: bloqId,
      title: 'Luitton Vouis Champs Elysées',
    });
  });
});

describe('PATCH /bloq/:id', () => {
  it('should update a specific bloq', async () => {
    const bloqUpdateDTO = {
      title: 'Glicinias Plaza',
      address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Portugal',
    } as UpdateBloqDto;

    const path = `/bloq/${bloqId}`;

    const response = await supertest
      .agent(app.getHttpServer())
      .patch(path)
      .send(bloqUpdateDTO)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.statusCode).toEqual(HttpStatus.OK);
    expect(response.body).toEqual({
      address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro, Portugal',
      id: bloqId,
      title: 'Glicinias Plaza',
    });
  });
});

describe('DELETE /bloq/:id', () => {
  it('should delete a bloq', async () => {
    const path = `/bloq/${bloqId}`;

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
