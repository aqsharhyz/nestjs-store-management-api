import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('CategoryController', () => {
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
  });

  afterAll(async () => {
    await testService.deleteAll();
  });

  describe('POST /api/category', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category')
        .set('Authorization', 'admin')
        .send({
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if category with the same name already exists', async () => {
      await testService.createCategory();
      const response = await request(app.getHttpServer())
        .post('/api/category')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/category')
        .set('Authorization', 'test')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/category')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test');
    });
  });

  describe('GET /api/category/:id', () => {
    beforeEach(async () => {
      await testService.createCategory();
    });

    it('should be rejected if category is not found', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .get(`/api/category/${category.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should not be rejected if user is not authenticated', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer()).get(
        `/api/category/${category.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
    });

    it('should be able to get category', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .get(`/api/category/${category.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
    });
  });

  describe('GET /api/category', () => {
    beforeEach(async () => {
      await testService.createCategories();
    });

    it('should be able to get categories', async () => {
      const response = await request(app.getHttpServer()).get('/api/category');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
    });

    it.todo('should be able to search categories');
  });

  describe('GET /api/category/:id/products', () => {
    it.todo('should be able to get category with its products');

    it.todo('should be rejected if category is not found');
  });

  describe('PATCH /api/category/:id', () => {
    beforeEach(async () => {
      await testService.createCategory();
    });

    it('should be rejected if request is invalid', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .set('Authorization', 'admin')
        .send({
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if category with the same name already exists', async () => {
      await testService.createCategory('test2');
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test2',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if category is not found', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id + 1}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test2',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const category = await testService.getCategory();
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .set('Authorization', 'test')
        .send({
          name: 'test2',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .send({
          name: 'test2',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update category', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .patch(`/api/category/${category.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test2',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test2');
    });
  });

  describe('DELETE /api/category/:id', () => {
    beforeEach(async () => {
      await testService.createCategory();
    });

    it('should be rejected if category is not found', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/category/${category.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const category = await testService.getCategory();
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .delete(`/api/category/${category.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer()).delete(
        `/api/category/${category.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete category', async () => {
      const category = await testService.getCategory();
      const response = await request(app.getHttpServer())
        .delete(`/api/category/${category.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test');
    });
  });
});
