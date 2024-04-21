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

    // const productWithSameCode = await this.prismaService.product.findFirst({
    //   where: {
    //     code: createRequest.code,
    //   },
    // });

    // if (productWithSameCode) {
    //   throw new HttpException(
    //     'Product with the same code already exists',
    //     HttpStatus.CONFLICT,
    //   );
    // }

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

    return this.toProductResponse(product);
  }

  // async getProducts(
  //   request?: SearchProductRequest,
  // ): Promise<ProductResponse[]> {}

  // async simpleSearchProduct(
  //   request: SimpleSearchProductRequest,
  // ): Promise<ProductResponse[]> {}

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

    //db validate
    if (updateRequest.code) {
      const productWithSameCode = await this.prismaService.product.findFirst({
        where: {
          code: updateRequest.code,
        },
      });
      if (productWithSameCode.id !== productId) {
        throw new HttpException(
          'Product with the same code already exists',
          HttpStatus.CONFLICT,
        );
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
        quantityInStock: updateRequest.quantity,
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

  toProductResponse(product: ProductResponse | Product): ProductResponse {
    return {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      quantityInStock: product.quantityInStock,
    };
  }
}
