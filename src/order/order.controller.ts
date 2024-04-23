import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/auth.guard';
import { OrderService } from './order.service';

@Controller('api/orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder() {}

  @Get('/:orderId')
  @HttpCode(HttpStatus.OK)
  async userGetOrder() {}

  @Patch('/:orderId')
  @HttpCode(HttpStatus.OK)
  async userUpdateOrder() {}
}
