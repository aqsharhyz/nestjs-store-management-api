import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from './supplier.model';
import { SupplierValidation } from './supplier.validation';
import { Supplier } from '@prisma/client';
import { ProductService } from '../product/product.service';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private productService: ProductService,
  ) {}

  async createSupplier(
    username: string,
    request: CreateSupplierRequest,
  ): Promise<SupplierResponse> {
    this.logger.debug(
      `User ${username} is creating a supplier ${JSON.stringify(request)}`,
    );

    const createRequest: CreateSupplierRequest =
      this.validationService.validate(SupplierValidation.CREATE, request);

    const supplier = await this.prismaService.supplier.create({
      data: createRequest,
    });

    return this.toSupplierResponse(supplier);
  }

  async getSupplier(supplierId: number): Promise<SupplierResponse> {
    this.logger.debug(`Getting supplier ${supplierId}`);

    const supplier = await this.prismaService.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new HttpException('Supplier not found', HttpStatus.NOT_FOUND);
    }

    return this.toSupplierResponse(supplier);
  }

  async getAllSuppliers(): Promise<SupplierResponse[]> {
    this.logger.debug('Getting all suppliers');

    const suppliers = await this.prismaService.supplier.findMany();

    return suppliers.map((supplier) => this.toSupplierResponse(supplier));
  }

  async getSupplierWithProducts(supplierId: number): Promise<SupplierResponse> {
    this.logger.debug(`Getting supplier ${supplierId} with products`);

    const supplier = await this.prismaService.supplier.findFirst({
      where: { id: supplierId },
      include: { products: true },
    });

    if (!supplier) {
      throw new HttpException('Supplier not found', HttpStatus.NOT_FOUND);
    }

    return this.toSupplierResponse(supplier, true);
  }

  async updateSupplier(
    username: string,
    supplierId: number,
    request: UpdateSupplierRequest,
  ): Promise<SupplierResponse> {
    this.logger.debug(
      `User ${username} is updating supplier ${supplierId} with ${JSON.stringify(request)}`,
    );

    const updateRequest: UpdateSupplierRequest =
      this.validationService.validate(SupplierValidation.UPDATE, request);

    let supplier = await this.prismaService.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new HttpException('Supplier not found', HttpStatus.NOT_FOUND);
    }

    supplier = await this.prismaService.supplier.update({
      where: { id: supplierId },
      data: updateRequest,
    });

    return this.toSupplierResponse(supplier);
  }

  async deleteSupplier(
    username: string,
    supplierId: number,
  ): Promise<SupplierResponse> {
    this.logger.debug(`User ${username} is deleting supplier ${supplierId}`);

    let supplier = await this.prismaService.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new HttpException('Supplier not found', HttpStatus.NOT_FOUND);
    }

    supplier = await this.prismaService.supplier.delete({
      where: { id: supplierId },
    });

    return this.toSupplierResponse(supplier);
  }

  toSupplierResponse(
    supplier: SupplierResponse,
    withProducts: boolean = false,
  ): SupplierResponse {
    return {
      id: supplier.id,
      name: supplier.name,
      phone: supplier.phone,
      address: supplier.address,
      // products: withProducts
      //   ? supplier.products.map((product) =>
      //       this.productService.toProductResponse(product),
      //     )
      //   : undefined,
    };
  }
}
