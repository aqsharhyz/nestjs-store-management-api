import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('ShipperController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);

    await testService.deleteAll();
    await testService.createAdmin();
    await testService.createUser();
  });

  afterAll(async () => {
    await testService.deleteAll();
  });

  describe('POST /api/shippers', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/shippers')
        .set('Authorization', 'admin')
        .send({
          name: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/shippers')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/shippers')
        .set('Authorization', 'test')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if shipper name already exists', async () => {
      await testService.createShipper();
      const response = await request(app.getHttpServer())
        .post('/api/shippers')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create shipper', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/shippers')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/shippers', () => {
    beforeEach(async () => {
      await testService.createShippers();
    });

    it('should be able to get all shippers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/shippers')
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('GET /api/shippers/:id', () => {
    beforeEach(async () => {
      await testService.createShipper();
    });

    it('should be rejected if shipper is not found', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .get(`/api/shippers/${shipper.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get shipper by id', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .get(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PATCH /api/shippers/:id', () => {
    beforeEach(async () => {
      await testService.createShipper();
    });

    it('should be rejected if shipper is not found', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id + 1}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'admin')
        .send({
          name: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id}`)
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'test')
        .send({
          name: 'test',
          phone: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if shipper name is already taken', async () => {
      await testService.createShipper('test1');
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test1',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update shipper', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .patch(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test1',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test1');
    });
  });

  describe('DELETE /api/shippers/:id', () => {
    beforeEach(async () => {
      await testService.createShipper();
    });

    it('should be rejected if shipper is not found', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .delete(`/api/shippers/${shipper.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer()).delete(
        `/api/shippers/${shipper.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .delete(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete shipper', async () => {
      const shipper = await testService.getShipper();
      const response = await request(app.getHttpServer())
        .delete(`/api/shippers/${shipper.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });
});
