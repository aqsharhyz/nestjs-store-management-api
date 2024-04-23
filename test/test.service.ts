import { Injectable } from '@nestjs/common';
import { PrismaService } from './../src/common/prisma.service';
import { Category, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteOrderDetail();
    await this.deleteOrder();
    await this.deleteProduct();
    await this.deleteShipper();
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

  async deleteShipper() {
    await this.prismaService.shipper.deleteMany();
  }

  async deleteOrder() {
    await this.prismaService.order.deleteMany();
  }

  async deleteOrderDetail() {
    await this.prismaService.orderDetail.deleteMany();
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

  async getShipper(name: string = 'test') {
    return this.prismaService.shipper.findFirst({
      where: {
        name,
      },
    });
  }

  async getOrder(comment: string = 'test') {
    return this.prismaService.order.findFirst({
      where: {
        comment,
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
    for (let i = 0; i < 21; i++) {
      await this.prismaService.product.create({
        data: {
          name: `test${i}`,
          price: 100 + i,
          code: `test${i}`,
          description: `test${i}`,
          quantityInStock: 10 + 2 * i,
          categoryId: (i % 3) + (await this.getCategory('test0')).id,
          supplierId: (i % 3) + (await this.getSupplier('test0')).id,
        },
      });
    }
  }

  async createShipper(name: string = 'test') {
    await this.prismaService.shipper.create({
      data: {
        name,
        phone: '45566778899',
      },
    });
  }

  async createShippers() {
    for (let i = 0; i < 3; i++) {
      await this.prismaService.shipper.create({
        data: {
          name: `test${i}`,
          phone: '45566778899',
        },
      });
    }
  }

  async createOrder() {
    await this.prismaService.order.create({
      data: {
        shippingPrice: 10,
        comment: 'test',
        shipperId: (await this.getShipper()).id,
        orderDate: new Date(),
        requiredDate: new Date(),
        username: 'test',
      },
    });

    const orderDetail = [
      {
        productId: (await this.getProduct()).id,
        quantityOrdered: 2,
        priceEach: 100,
        orderId: (await this.getOrder()).id,
      },
    ];

    await this.prismaService.orderDetail.createMany({
      data: orderDetail,
    });
  }

  async createOrders() {
    await this.createShippers();
    await this.createProducts();
    for (let i = 0; i < 5; i++) {
      await this.prismaService.order.create({
        data: {
          shippingPrice: 10,
          comment: `test${i}`,
          shipperId: (i % 3) + (await this.getShipper('test0')).id,
          orderDate: new Date(),
          requiredDate: new Date(),
          username: 'test',
        },
      });
      for (let j = 0; j < 3; j++) {
        await this.prismaService.orderDetail.create({
          data: {
            productId: (j % 3) + (await this.getProduct('test0')).id,
            quantityOrdered: j * 2,
            priceEach: 100 + j * 2,
            orderId: (await this.getOrder(`test${i}`)).id,
          },
        });
      }
    }
  }
}
