import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { Auth } from '../common/auth.decorator';
import {
  CreateShipperRequest,
  ShipperResponse,
  UpdateShipperRequest,
} from './shipper.model';
import { WebResponse } from '../common/web.model';
import { AdminGuard } from '../common/admin.guard';

@Controller('api/shippers')
export class ShipperController {
  constructor(private shipperService: ShipperService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  async createShipper(
    @Auth('username') username: string,
    @Body() request: CreateShipperRequest,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.createShipper(username, request);
    return { data: shipper };
  }

  @Get('/:shipperId')
  @HttpCode(HttpStatus.OK)
  async getShipper(
    @Param('shipperId', ParseIntPipe) shipperId: number,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.getShipper(shipperId);
    return { data: shipper };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllShippers(): Promise<WebResponse<ShipperResponse[]>> {
    const shippers = await this.shipperService.getAllShippers();
    return { data: shippers };
  }

  @Get('/:shipperId/orders')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async getShipperOrders(
    @Param('shipperId', ParseIntPipe) shipperId: number,
  ): Promise<WebResponse<ShipperResponse>> {
    const orders = await this.shipperService.getShipperWithOrders(shipperId);
    return { data: orders };
  }

  @Patch('/:shipperId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateShipper(
    @Auth('username') username: string,
    @Param('shipperId', ParseIntPipe) shipperId: number,
    @Body() request: UpdateShipperRequest,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.updateShipper(
      username,
      shipperId,
      request,
    );
    return { data: shipper };
  }

  @Delete('/:shipperId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async deleteShipper(
    @Auth('username') username,
    @Param('shipperId', ParseIntPipe) shipperId: number,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.deleteShipper(
      username,
      shipperId,
    );
    return { data: shipper };
  }
}
