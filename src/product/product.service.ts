import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateProductRequest,
  ProductResponse,
  SearchProductRequest,
  SimpleSearchProductRequest,
  updateProductRequest,
  updateProductStockRequest,
} from './product.model';
import { ProductValidation } from './product.validation';
import { Product } from '@prisma/client';
import { Logger } from 'winston';
import { WebResponse } from 'src/common/web.model';

@Injectable()
export class ProductService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createProduct(
    username: string,
    request: CreateProductRequest,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `ProductService.createProduct({Admin: ${username}, request: ${JSON.stringify(request)})`,
    );

    const createRequest: CreateProductRequest = this.validationService.validate(
      ProductValidation.CREATE,
      request,
    );

    const productWithSameCodeOrName =
      await this.prismaService.product.findFirst({
        where: {
          OR: [{ code: createRequest.code }, { name: createRequest.name }],
        },
      });

    if (productWithSameCodeOrName) {
      throw new HttpException(
        'Product with the same code already exists',
        HttpStatus.CONFLICT,
      );
    }

    const checkCategory = await this.prismaService.category.findFirst({
      where: {
        id: createRequest.category_id,
      },
    });

    if (!checkCategory) {
      throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);
    }

    const checkSupplier = await this.prismaService.supplier.findFirst({
      where: {
        id: createRequest.supplier_id,
      },
    });

    if (!checkSupplier) {
      throw new HttpException('Supplier is not found', HttpStatus.NOT_FOUND);
    }

    const product = await this.prismaService.product.create({
      data: {
        ...createRequest,
      },
    });

    return this.toProductResponse(product);
  }

  async getProduct(productId: number): Promise<ProductResponse> {
    this.logger.debug(`ProductService.getProduct({productId: ${productId})`);

    const product = await this.prismaService.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new HttpException('Product is not found', HttpStatus.NOT_FOUND);
    }

    return this.toProductResponse(product);
  }

  async getListProducts(
    request?: SearchProductRequest,
  ): Promise<WebResponse<ProductResponse[]>> {
    this.logger.debug(
      `ProductService.getProducts({request: ${JSON.stringify(request)})`,
    );

    const searchRequest: SearchProductRequest = this.validationService.validate(
      ProductValidation.SEARCH,
      request,
    );

    const filter = [];

    if (searchRequest.code) {
      filter.push({
        code: {
          contains: searchRequest.code,
          mode: 'insensitive',
        },
      });
    }

    if (searchRequest.name) {
      filter.push({
        name: {
          contains: searchRequest.name,
          mode: 'insensitive',
        },
      });
    }

    if (searchRequest.description) {
      filter.push({
        description: {
          contains: searchRequest.description,
          mode: 'insensitive',
        },
      });
    }

    //price

    //quantityInStock

    //category

    //supplier

    //   category_id?: number;
    //   supplier_id?: number;

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const products = await this.prismaService.product.findMany({
      where: {
        AND: filter,
      },
      take: searchRequest.size,
      skip,
    });

    const total = await this.prismaService.product.count({
      where: {
        AND: filter,
      },
    });
    return {
      data: products.map((product) => this.toProductResponse(product)),
      paging: {
        current_page: searchRequest.page,
        size: products.length,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }

  // export class SearchProductRequest {
  //   code?: string;
  //   name?: string;
  //   price?: number;
  //   description?: string;
  //   quantityInStock?: number;

  //   page?: number;
  //   size?: number;
  //   sort?: string;
  // }

  async simpleSearchProduct(
    request: SimpleSearchProductRequest,
  ): Promise<WebResponse<ProductResponse[]>> {
    this.logger.debug(
      `ProductService.simpleSearchProduct({request: ${JSON.stringify(request)})`,
    );

    const searchRequest: SimpleSearchProductRequest =
      this.validationService.validate(ProductValidation.SIMPLE_SEARCH, request);

    const filter = {
      OR: [
        {
          code: {
            contains: searchRequest.search,
            mode: 'insensitive',
          },
        },
        {
          name: {
            contains: searchRequest.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchRequest.search,
            mode: 'insensitive',
          },
        },
      ],
    };

    const product = await this.prismaService.product.findMany({
      where: filter,
      take: 20,
      skip: (searchRequest.page - 1) * 20,
    });

    const total: number = await this.prismaService.product.count({
      where: filter,
    });

    return {
      paging: {
        size: product.length,
        current_page: searchRequest.page,
        total_page: Math.ceil(total / 20),
      },
      data: product.map((product) => this.toProductResponse(product)),
    };
  }

  async updateProduct(
    username: string,
    productId: number,
    request: updateProductRequest,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `ProductService.updateProduct({Admin: ${username}, request: ${JSON.stringify(request)})`,
    );

    const updateRequest: updateProductRequest = this.validationService.validate(
      ProductValidation.UPDATE,
      request,
    );

    if (updateRequest.code) {
      const productWithSameCode = await this.prismaService.product.findFirst({
        where: {
          code: updateRequest.code,
        },
      });
      if (productWithSameCode && productWithSameCode.id !== productId) {
        throw new HttpException(
          'Product with the same code already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateRequest.name) {
      const productWithSameName = await this.prismaService.product.findFirst({
        where: {
          name: updateRequest.name,
        },
      });
      if (productWithSameName && productWithSameName.id !== productId) {
        throw new HttpException(
          'Product with the same name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateRequest.category_id) {
      const checkCategory = await this.prismaService.category.findFirst({
        where: {
          id: updateRequest.category_id,
        },
      });

      if (!checkCategory) {
        throw new HttpException('Category is not found', HttpStatus.NOT_FOUND);
      }
    }

    if (updateRequest.supplier_id) {
      const checkSupplier = await this.prismaService.supplier.findFirst({
        where: {
          id: updateRequest.supplier_id,
        },
      });

      if (!checkSupplier) {
        throw new HttpException('Supplier is not found', HttpStatus.NOT_FOUND);
      }
    }

    const product = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateRequest,
      },
    });

    return this.toProductResponse(product);
  }

  async updateStockProduct(
    username: string,
    productId: number,
    request: updateProductStockRequest,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `ProductService.updateStockProduct({Admin: ${username}, request: ${JSON.stringify(request)})`,
    );

    const updateRequest: updateProductStockRequest =
      this.validationService.validate(ProductValidation.UPDATE_STOCK, request);

    const product = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        stock: updateRequest.quantity,
      },
    });

    return this.toProductResponse(product);
  }

  async removeProduct(
    username: string,
    productId: number,
  ): Promise<ProductResponse> {
    this.logger.debug(
      `ProductService.removeProduct({Admin: ${username}, productId: ${productId})`,
    );

    const product = await this.prismaService.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new HttpException('Product is not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.product.delete({
      where: {
        id: productId,
      },
    });

    return this.toProductResponse(product);
  }

  toProductResponse(product: Product): ProductResponse {
    return product;
    // return {
    //   id: product.id,
    //   code: product.code,
    //   name: product.name,
    //   description: product.description,
    //   price: product.price,
    //   stock: product.quantityInStock,
    // };
  }
}
