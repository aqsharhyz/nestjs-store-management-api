import { Injectable } from '@nestjs/common';
import { PrismaService } from './../src/common/prisma.service';
import { Category, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteUser();
    // await this.deleteAdmin();
    await this.deleteCategory();
    await this.deleteSupplier();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany();
  }

  // async deleteAdmin() {
  //   await this.prismaService.user.deleteMany({
  //     where: {
  //       username: 'admin',
  //     },
  //   });
  // }

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

  async getCategory(): Promise<Category> {
    return this.prismaService.category.findFirst({
      where: {
        name: 'test',
      },
    });
  }

  async getSupplier() {
    return this.prismaService.supplier.findFirst({
      where: {
        name: 'test',
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
    // await this.prismaService.product.create({
    //   data: {
    //   },
    // });
  }
}
