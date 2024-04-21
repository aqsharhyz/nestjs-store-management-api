import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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
  });

  afterAll(async () => {
    await testService.deleteAll();
  });

  describe('POST /api/user/register', () => {
    beforeEach(async () => {});

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it.todo('should be rejected if password is not strong enough');

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'Test12!',
          name: 'test',
          email: 'test@example.com',
          phone: '485566667789',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });

    it('should be rejected if username already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test',
          password: 'Test12!',
          name: 'test',
          email: 'test@example.com',
          phone: '485566667789',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if email already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: 'test1',
          password: 'Test12!',
          name: 'test',
          email: 'test@example.com',
          phone: '485566667789',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.errors).toBeDefined();
    });

    it('shoud prevent sql injection', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/register')
        .send({
          username: "'; DROP TABLE users;--",
          email: "'; DROP TABLE users;--@example.com",
          name: "'; DROP TABLE users;--",
          password: "'; DROP TABLE users;--",
          phone: '485566667789',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // it('should prevent XSS attack', async () => {
    //   const response = await request(app.getHttpServer())
    //     .post('/api/user/register')
    //     .send({
    //       username: '<script>alert("XSS attack")</script>',
    //       email: 'xss@example.com',
    //       password: 'Test12!',
    //       name: 'test',
    //       phone: '485566667789',
    //     });

    //   logger.info(response.body);

    //   expect(response.status).toBe(201);
    //   expect(response.body.data.username).toBe(
    //     '<script>alert("XSS attack")</script>',
    //   );
    // });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {});

    it('should be able to login with username', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'Test12!',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });

    it.skip('should be able to login with email', async () => {
      await testService.createUser();

      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          email: 'test@example.com',
          password: 'Test12!',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: '',
          password: 's',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if username does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if password is incorrect', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/user/login')
        .send({
          username: 'test',
          password: 'wrong',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/user/current', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be able to get current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/current')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/user/current')
        .set('Authorization', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/user/current', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if not authorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .set('Authorization', 'test')
        .send({
          name: '',
          username: 'test1',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update user', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current')
        .set('Authorization', 'test')
        .send({
          name: 'test1',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test1');
    });
  });

  describe('PATCH /api/user/current/password', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current/password')
        .set('Authorization', 'test')
        .send({
          old_password: 'Test12!',
          new_password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if old password is incorrect', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current/password')
        .set('Authorization', 'test')
        .send({
          old_password: 'wrong',
          new_password: 'Test13!',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if not authorized with token', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current/password')
        .set('Authorization', 'wrong')
        .send({
          old_password: 'Test12!',
          new_password: 'Test13!',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if new password is not strong enough', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current/password')
        .set('Authorization', 'test')
        .send({
          old_password: 'Test12!',
          new_password: 'Test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update password', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/user/current/password')
        .set('Authorization', 'test')
        .send({
          old_password: 'Test12!',
          new_password: 'Test13!',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/user/current', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    it('should be rejected if not authorized', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/user/current',
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/user/current')
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });
  });
});
