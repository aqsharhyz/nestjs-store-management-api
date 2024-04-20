import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model';
import { CategoryValidation } from './category.validation';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createCategory(
    username: string,
    request: CreateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.debug(
      `Creating category: Admin: ${username}, Request: ${JSON.stringify(request)}`,
    );

    const createRequest: CreateCategoryRequest =
      this.validationService.validate(CategoryValidation.CREATE, request);

    const categoryWithSameName = await this.prismaService.category.findFirst({
      where: {
        name: createRequest.name,
      },
    });

    if (categoryWithSameName) {
      throw new HttpException(
        'Category with the same name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const category = await this.prismaService.category.create({
      data: {
        ...createRequest,
      },
    });

    return this.toCategoryResponse(category);
  }

  async getCategory(categoryId: number): Promise<CategoryResponse> {
    this.logger.debug(`Getting category: ${categoryId}`);

    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return this.toCategoryResponse(category);
  }

  async getAllCategories(): Promise<CategoryResponse[]> {
    this.logger.debug('Getting all categories');

    const categories = await this.prismaService.category.findMany();

    return categories.map((category) => this.toCategoryResponse(category));
  }

  async getCategoryWithProducts(categoryId: number): Promise<CategoryResponse> {
    const category = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      // throw new NotFoundException('Category not found');
    }

    return this.toCategoryResponse(category, true);
  }

  async updateCategory(
    username: string,
    categoryId: number,
    request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.debug(
      `Updating category: Admin: ${username}, Category: ${categoryId}`,
    );

    const updateRequest: CreateCategoryRequest =
      this.validationService.validate(CategoryValidation.UPDATE, request);

    if (updateRequest.name) {
      const categoryWithSameName = await this.prismaService.category.findFirst({
        where: {
          name: updateRequest.name,
        },
      });
      if (categoryWithSameName.id !== categoryId) {
        throw new HttpException(
          'Category with the same name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const category = await this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...updateRequest,
      },
    });

    return this.toCategoryResponse(category);
  }

  async removeCategory(
    username: string,
    categoryId: number,
  ): Promise<CategoryResponse> {
    this.logger.debug(
      `Removing category: Admin: ${username}, Category: ${categoryId}`,
    );

    const category = await this.prismaService.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });

    return this.toCategoryResponse(category);
  }

  toCategoryResponse(
    category: CategoryResponse,
    withProducts: boolean = false,
  ): CategoryResponse {
    return {
      // id: category.id,
      name: category.name,
      // description: category.description,
      products: withProducts ? category.products : undefined,
    };
  }
}
