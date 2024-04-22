import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
  CreateShipperRequest,
  ShipperResponse,
  UpdateShipperRequest,
} from './shipper.model';
import { SupplierValidation } from '../supplier/supplier.validation';
import { Shipper } from '@prisma/client';

@Injectable()
export class ShipperService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createShipper(
    username: string,
    request: CreateShipperRequest,
  ): Promise<ShipperResponse> {
    this.logger.debug(
      `User ${username} is creating a shipper ${JSON.stringify(request)}`,
    );

    const createRequest: CreateShipperRequest = this.validationService.validate(
      SupplierValidation.CREATE,
      request,
    );

    const shipperWithSameName = await this.prismaService.shipper.findFirst({
      where: { name: createRequest.name },
    });

    if (shipperWithSameName) {
      throw new HttpException(
        'Shipper with the same name already exists',
        HttpStatus.CONFLICT,
      );
    }

    const shipper = await this.prismaService.shipper.create({
      data: createRequest,
    });

    return this.toShipperResponse(shipper);
  }

  async getShipper(shipperId: number): Promise<ShipperResponse> {
    this.logger.debug(`Getting shipper ${shipperId}`);

    const shipper = await this.prismaService.shipper.findUnique({
      where: { id: shipperId },
    });

    if (!shipper) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }

    return this.toShipperResponse(shipper);
  }

  async getAllShippers(): Promise<ShipperResponse[]> {
    this.logger.debug('Getting all shippers');

    const shippers = await this.prismaService.shipper.findMany();

    return shippers.map((shipper) => this.toShipperResponse(shipper));
  }

  async getShipperWithOrders(shipperId: number): Promise<ShipperResponse> {
    this.logger.debug(`Getting shipper ${shipperId} with orders`);

    const shipper = await this.prismaService.shipper.findUnique({
      where: { id: shipperId },
      include: { order: true },
    });

    if (!shipper) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }

    return this.toShipperResponse(shipper);
  }

  async updateShipper(
    username: string,
    shipperId: number,
    request: UpdateShipperRequest,
  ): Promise<ShipperResponse> {
    this.logger.debug(
      `User ${username} is updating shipper ${shipperId} with ${JSON.stringify(
        request,
      )}`,
    );

    const updateRequest: UpdateShipperRequest = this.validationService.validate(
      SupplierValidation.UPDATE,
      request,
    );

    let shipper = await this.prismaService.shipper.findUnique({
      where: { id: shipperId },
    });

    if (!shipper) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }

    if (updateRequest.name) {
      const shipperWithSameName = await this.prismaService.shipper.findFirst({
        where: { name: updateRequest.name },
      });

      if (shipperWithSameName) {
        throw new HttpException(
          'Shipper with the same name already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    shipper = await this.prismaService.shipper.update({
      where: { id: shipperId },
      data: updateRequest,
    });

    return this.toShipperResponse(shipper);
  }

  async deleteShipper(
    username: string,
    shipperId: number,
  ): Promise<ShipperResponse> {
    this.logger.debug(`User ${username} is deleting shipper ${shipperId}`);

    const shipper = await this.prismaService.shipper.findUnique({
      where: { id: shipperId },
    });

    if (!shipper) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }

    await this.prismaService.shipper.delete({
      where: { id: shipperId },
    });

    return this.toShipperResponse(shipper);
  }

  toShipperResponse(shipper: ShipperResponse): ShipperResponse {
    return {
      id: shipper.id,
      name: shipper.name,
      phone: shipper.phone,
      //   orders: shipper.order.map((order) =>
      //     this.productService.toOrderResponse(order),
      //   ),
      orders: shipper.orders,
    };
  }
}
