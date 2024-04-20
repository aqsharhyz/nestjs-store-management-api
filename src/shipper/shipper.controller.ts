import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { Auth } from 'src/common/auth.decorator';
import {
  CreateShipperRequest,
  ShipperResponse,
  UpdateShipperRequest,
} from './shipper.model';
import { WebResponse } from 'src/common/web.model';

@Controller('shipper')
export class ShipperController {
  constructor(private shipperService: ShipperService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createShipper(
    @Auth('username') username: string,
    request: CreateShipperRequest,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.createShipper(username, request);
    return { data: shipper };
  }

  @Get('/shipperId')
  @HttpCode(HttpStatus.OK)
  async getShipper(
    @Param('shipperId') shipperId: number,
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
  async getShipperOrders(
    @Param('shipperId') shipperId: number,
  ): Promise<WebResponse<ShipperResponse>> {
    const orders = await this.shipperService.getShipperWithOrders(shipperId);
    return { data: orders };
  }

  @Patch('/:shipperId')
  @HttpCode(HttpStatus.OK)
  async updateShipper(
    @Auth('username') username: string,
    @Param('shipperId') shipperId: number,
    request: UpdateShipperRequest,
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
  async deleteShipper(
    @Auth('username') username,
    @Param('shipperId') shipperId: number,
  ): Promise<WebResponse<ShipperResponse>> {
    const shipper = await this.shipperService.deleteShipper(
      username,
      shipperId,
    );
    return { data: shipper };
  }
}
