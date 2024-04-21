import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('ProductController', () => {
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
  });

  afterAll(async () => {
    await testService.deleteAll();
  });

  describe('POST /api/products', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it.skip('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({
          code: '',
          name: '',
          stock: '',
          price: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it.skip('should be able to create product', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({
          code: 'test',
          name: 'test',
          stock: 10,
          price: 10000,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.code).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });
});
