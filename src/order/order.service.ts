import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { Order, Shipper } from '@prisma/client';
import {
  CreateOrderRequest,
  OrderResponse,
  UserUpdateOrderRequest,
} from './order.model';
import { OrderValidation } from './order.validation';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createOrder(
    username: string,
    request: CreateOrderRequest,
  ): Promise<OrderResponse> {
    this.logger.debug(
      `User ${username} is creating an order ${JSON.stringify(request)}`,
    );

    const createRequest: CreateOrderRequest = this.validationService.validate(
      OrderValidation.CREATE,
      request,
    );

    const shipperExists = await this.checkIfShipperExists(
      createRequest.shipperId,
    );

    if (!shipperExists) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }

    const order = await this.prismaService.order.create({
      data: createRequest,
    });

    return this.toOrderResponse(order);
  }

  async getOrder(orderId: number): Promise<OrderResponse> {
    this.logger.debug(`Getting order ${orderId}`);

    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
      include: { orderDetails: true },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return this.toOrderResponse(order);
  }

  async userUpdateOrder(
    username: string,
    orderId: number,
    request: UserUpdateOrderRequest,
  ): Promise<OrderResponse> {
    this.logger.debug(
      `User ${username} is updating order ${orderId} with ${JSON.stringify(request)}`,
    );

    const updateRequest: UserUpdateOrderRequest =
      this.validationService.validate(OrderValidation.UPDATE, request);

    const order = await this.prismaService.order.findFirst({
      where: {
        id: orderId,
        username: username,
      },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const updatedOrder = await this.prismaService.order.update({
      where: { id: orderId },
      data: updateRequest,
    });

    return this.toOrderResponse(updatedOrder);
  }

  // async deleteOrder(username: string, orderId: number): Promise<OrderResponse> {
  //     this.logger.debug(`User ${username} is deleting order ${orderId}`);

  //     const order = await this.prismaService.order.findFirst({
  //       where: {
  //         id: orderId,
  //         username: username,
  //       },
  //     });

  //     if (!order) {
  //       throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  //     }

  //     await this.prismaService.order.delete({
  //       where: { id: orderId },
  //     });

  //     return this.toOrderResponse(order);
  //   }

  async checkIfShipperExists(shipperId: number): Promise<boolean> {
    const shipper = await this.prismaService.shipper.findUnique({
      where: { id: shipperId },
    });
    return shipper ? true : false;
  }

  toOrderResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      username: order.username,
      shippingPrice: order.shippingPrice,
      comment: order.comment,
      status: order.status,
      shipperId: order.shipperId,
      orderDate: order.orderDate,
      requiredDate: order.requiredDate,
      shippedDate: order.shippedDate,
      orderDetail: order.orderDetail.map((od) => ({
        productId: od.productId,
        quantityOrdered: od.quantityOrdered,
        priceEach: od.priceEach,
      })),
    };
  }
}
