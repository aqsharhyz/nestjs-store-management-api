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

    await testService.deleteAll();
    await testService.createUser();
    await testService.createAdmin();
    await testService.createCategory();
    await testService.createSupplier();
    // await testService.createCategories();
    // await testService.createSuppliers();
  });

  afterAll(async () => {
    await testService.deleteAll();
  });

  describe('POST /api/products', () => {
    beforeEach(async () => {});

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: '',
          name: '',
          price: '',
          description: 'dasf',
          quantityInStock: -1,
          categoryId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .send({
          code: 'test',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'test')
        .send({
          code: 'test',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if category does not exist', async () => {
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: 'test',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId + 1,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if supplier does not exist', async () => {
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: 'test',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId + 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if product with same code already exists', async () => {
      await testService.createProduct();
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: 'test',
          name: 'test1',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if product with same name already exists', async () => {
      await testService.createProduct();
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: 'test1',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create product', async () => {
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', 'admin')
        .send({
          code: 'test',
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.code).toBe('test');
      expect(response.body.name).toBe('test');
      expect(response.body.price).toBe(10000);
      expect(response.body.description).toBe('test');
      expect(response.body.quantityInStock).toBe(10);
      // expect(response.body.categoryId).toBe(categoryId);
    });
  });

  describe('GET /api/products/:id', () => {
    beforeEach(async () => {
      await testService.createProduct();
    });

    it('should be rejected if product does not exist', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .get(`/api/products/${product.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should not be rejected if user is not authenticated', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer()).get(
        `/api/products/${product.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.code).toBe(product.code);
      expect(response.body.name).toBe(product.name);
      expect(response.body.price).toBe(product.price);
      expect(response.body.description).toBe(product.description);
      expect(response.body.quantityInStock).toBe(product.quantityInStock);
    });

    it('should be able to get product', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .get(`/api/products/${product.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.code).toBe(product.code);
      expect(response.body.name).toBe(product.name);
      expect(response.body.price).toBe(product.price);
      expect(response.body.description).toBe(product.description);
      expect(response.body.quantityInStock).toBe(product.quantityInStock);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await testService.createProducts();
    });

    it.todo('should be able to get all products');
  });

  describe('PATCH /api/products/:id', () => {
    beforeEach(async () => {
      await testService.createProduct();
    });

    it('should be rejected if request is invalid', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          name: '',
          price: '',
          description: 'dasf',
          quantityInStock: -1,
          categoryId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if product does not exist', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id + 1}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test2',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .send({
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'test')
        .send({
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if category does not exist', async () => {
      const product = await testService.getProduct();
      const categoryId = (await testService.getCategory()).id;
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId + 1,
          supplierId: 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if supplier does not exist', async () => {
      const product = await testService.getProduct();
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: 1,
          supplierId: supplierId + 1,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if product with same code already exists', async () => {
      await testService.createProducts();
      const product = await testService.getProduct();
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          code: 'test0',
          name: 'test1',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if product with same name already exists', async () => {
      await testService.createProducts();
      const product = await testService.getProduct();
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          code: 'test',
          name: 'test0',
          price: 10000,
          description: 'test',
          quantityInStock: 10,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update product', async () => {
      const product = await testService.getProduct();
      const categoryId = (await testService.getCategory()).id;
      const supplierId = (await testService.getSupplier()).id;
      const response = await request(app.getHttpServer())
        .patch(`/api/products/${product.id}`)
        .set('Authorization', 'admin')
        .send({
          code: 'test100',
          name: 'test100',
          price: 20000,
          description: 'test123',
          quantityInStock: 30,
          categoryId: categoryId,
          supplierId: supplierId,
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.code).toBe('test100');
      expect(response.body.name).toBe('test100');
      expect(response.body.price).toBe(20000);
      expect(response.body.description).toBe('test123');
      expect(response.body.quantityInStock).toBe(30);
      // expect(response.body.categoryId).toBe(categoryId);
    });
  });

  describe('DELETE /api/products/:id', () => {
    beforeEach(async () => {
      await testService.createProduct();
    });

    it('should be rejected if product does not exist', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${product.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer()).delete(
        `/api/products/${product.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${product.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete product', async () => {
      const product = await testService.getProduct();
      const response = await request(app.getHttpServer())
        .delete(`/api/products/${product.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(product.id);
      expect(response.body.code).toBe(product.code);
      expect(response.body.name).toBe(product.name);
      expect(response.body.price).toBe(product.price);
      expect(response.body.description).toBe(product.description);
      expect(response.body.quantityInStock).toBe(product.quantityInStock);
    });
  });
});
