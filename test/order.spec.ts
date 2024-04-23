import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('OrderController', () => {
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

  describe('POST /api/orders', () => {
    beforeEach(async () => {});