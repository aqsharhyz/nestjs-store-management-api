import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { User, Book } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteBook();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteBook() {
    await this.prismaService.book.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getBook(): Promise<Book> {
    return this.prismaService.book.findFirst({
      where: {
        username: 'test',
      },
    });
  }

  async createBook() {
    await this.prismaService.book.create({
      data: {
        title: 'test',
        year: 2021,
        author: 'test',
        publisher: 'test',
        isFinished: false,
        username: 'test',
      },
    });
  }
}
