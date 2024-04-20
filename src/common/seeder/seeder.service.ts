import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(private prismaService: PrismaService) {}

  async seedAll(): Promise<void> {
    await this.userSeed();
    await this.categorySeed();
    await this.productSeed();
    // await this.orderSeed();
  }

  async userSeed(counter: number = 10): Promise<void> {
    for (let i = 0; i < counter; i++) {
      await this.prismaService.user.create({
        data: {
          username: faker.person.firstName(),
          password: faker.internet.password(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          // token: faker.string.uuid(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
        },
      });
    }
  }

  async productSeed(counter: number = 10): Promise<void> {
    for (let i = 0; i < counter; i++) {
      await this.prismaService.product.create({
        data: {
          code: faker.string.nanoid(5),
          name: faker.commerce.productName(),
          price: faker.number.float(10000),
          quantityInStock: faker.number.int(1000),
          description: faker.commerce.productDescription(),
          categoryId: faker.number.int(5),
          supplierId: faker.number.int(5),
        },
      });
    }
  }

  async categorySeed(counter: number = 10): Promise<void> {
    for (let i = 0; i < counter; i++) {
      await this.prismaService.category.create({
        data: {
          name: faker.commerce.department(),
        },
      });
    }
  }

  //   async orderSeed(counter: number = 10): Promise<void> {
  //     for (let i = 0; i < counter; i++) {
  //       await this.prismaService.order.create({
  //         data: {
  //           username: faker.number.int(10),
  //           orderDate: faker.date.recent(),
  //           requiredDate: faker.date.soon(),
  //           status: faker.helpers.arrayElement([
  //             'In_Process',
  //             'Shipped',
  //             'Cancelled',
  //           ]),
  //           total: faker.number.float(1000000),
  //         },
  //       });
  //     }
  //   }
}
