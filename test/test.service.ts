import { Injectable } from '@nestjs/common';
import { PrismaService } from './../src/common/prisma.service';
import { Category, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteProduct();
    await this.deleteSupplier();
    await this.deleteCategory();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany();
  }

  async deleteCategory() {
    await this.prismaService.category.deleteMany();
  }

  async deleteSupplier() {
    await this.prismaService.supplier.deleteMany();
  }

  async deleteProduct() {
    await this.prismaService.product.deleteMany();
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async getCategory(name: string = 'test'): Promise<Category> {
    return this.prismaService.category.findFirst({
      where: {
        name: name,
      },
    });
  }

  async getSupplier(name: string = 'test') {
    return this.prismaService.supplier.findFirst({
      where: {
        name,
      },
    });
  }

  async getProduct(name: string = 'test') {
    return this.prismaService.product.findFirst({
      where: {
        name: name,
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('Test12!', 10),
        token: 'test',
        email: 'test@example.com',
        phone: '485566667789',
        role: 'USER',
      },
    });
  }

  async createAdmin() {
    await this.prismaService.user.create({
      data: {
        username: 'admin',
        name: 'admin',
        password: await bcrypt.hash('Admin12!', 10),
        token: 'admin',
        email: 'admin@example.com',
        phone: '485566667789',
        role: 'ADMIN',
      },
    });
  }

  async createCategory(name: string = 'test') {
    await this.prismaService.category.create({
      data: {
        name: name,
      },
    });
  }

  async createCategories() {
    for (let i = 0; i < 3; i++) {
      await this.prismaService.category.create({
        data: {
          name: `test${i}`,
        },
      });
    }
  }

  async createSupplier(name: string = 'test') {
    await this.prismaService.supplier.create({
      data: {
        name: name,
        phone: '45566778899',
        address: 'test address',
      },
    });
  }

  async createSuppliers() {
    for (let i = 0; i < 3; i++) {
      await this.prismaService.supplier.create({
        data: {
          name: `test${i}`,
          phone: '45566778899',
        },
      });
    }
  }

  async createProduct() {
    await this.prismaService.product.create({
      data: {
        name: 'test',
        price: 100,
        code: 'test',
        description: 'test',
        quantityInStock: 10,
        categoryId: await this.getCategory().then((category) => category.id),
        supplierId: await this.getSupplier().then((supplier) => supplier.id),
      },
    });
  }

  async createProducts() {
    await this.createCategories();
    await this.createSuppliers();
    for (let i = 0; i < 20; i++) {
      await this.prismaService.product.create({
        data: {
          name: `test${i}`,
          price: 100 + i,
          code: `test${i}`,
          description: `test${i}`,
          quantityInStock: 10 + 2 * i,
          categoryId: (i % 3) + (await this.getCategory('test0')).id,
          supplierId: (1 % 3) + (await this.getSupplier('test0')).id,
        },
      });
    }
  }
}
