import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('SupplierController', () => {
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

  describe('POST /api/supplier', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/supplier')
        .set('Authorization', 'admin')
        .send({
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/supplier')
        .send({
          name: 'test',
          phone: '45566778899',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/supplier')
        .set('Authorization', 'test')
        .send({
          name: 'test',
          phone: '45566778899',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create a supplier', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/supplier')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: '45566778899',
          address: 'test address',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.phone).toBe('45566778899');
      expect(response.body.data.address).toBe('test address');
    });

    it('should be able to create a supplier without optional fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/supplier')
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: '45566778899',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.phone).toBe('45566778899');
      expect(response.body.data.address).toBeNull();
    });
  });

  describe('GET /api/supplier/:supplierId', () => {
    beforeEach(async () => {
      await testService.createSupplier();
    });

    it('should be rejected if supplier is not found', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer()).get(
        `/api/supplier/${supplier.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get supplier', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.phone).toBe('45566778899');
      expect(response.body.data.address).toBe('test address');
    });
  });

  describe('GET /api/supplier', () => {
    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer()).get('/api/supplier');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .get('/api/supplier')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get all suppliers', async () => {
      await testService.createSuppliers();
      const response = await request(app.getHttpServer())
        .get('/api/supplier')
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.length).toBe(3);
    });
  });

  describe('GET /api/supplier/products', () => {
    beforeEach(async () => {
      await testService.createSupplier();
      // await testService.createProduct();
    });

    it('should be rejected if supplier is not found', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id + 1}/products`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer()).get(
        `/api/supplier/${supplier.id}/products`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id}/products`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get all products of a supplier', async () => {
      await testService.createProducts();
      const supplier = await testService.getSupplier('test0');
      const response = await request(app.getHttpServer())
        .get(`/api/supplier/${supplier.id}/products`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test0');
      expect(response.body.data.products.length).toBe(7);
    });
  });

  describe('PATCH /api/supplier/:supplierId', () => {
    beforeEach(async () => {
      await testService.createSupplier();
    });

    it('should be rejected if request is invalid', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .patch(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'admin')
        .send({
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if supplier is not found', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .patch(`/api/supplier/${supplier.id + 1}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test',
          phone: '45566778899',
          address: 'test address',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .patch(`/api/supplier/${supplier.id}`)
        .send({
          name: 'test',
          phone: '45566778899',
          address: 'test address',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .patch(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'test')
        .send({
          name: 'test',
          phone: '45566778899',
          address: 'test address',
        });

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update supplier', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .patch(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'admin')
        .send({
          name: 'test updated',
          phone: '45566778899',
          address: 'test address updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(supplier.id);
      expect(response.body.data.name).toBe('test updated');
      expect(response.body.data.phone).toBe('45566778899');
      expect(response.body.data.address).toBe('test address updated');
    });
  });

  describe('DELETE /api/supplier/:supplierId', () => {
    beforeEach(async () => {
      await testService.createSupplier();
    });

    it('should be rejected if supplier is not found', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .delete(`/api/supplier/${supplier.id + 1}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not authenticated', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer()).delete(
        `/api/supplier/${supplier.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if user is not admin', async () => {
      await testService.createUser();
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .delete(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(403);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete supplier', async () => {
      const supplier = await testService.getSupplier();
      const response = await request(app.getHttpServer())
        .delete(`/api/supplier/${supplier.id}`)
        .set('Authorization', 'admin');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
