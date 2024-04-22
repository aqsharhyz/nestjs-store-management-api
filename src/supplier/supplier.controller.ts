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
import { SupplierService } from './supplier.service';
import { AdminGuard } from '../common/admin.guard';
import { Auth } from '../common/auth.decorator';
import {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from './supplier.model';
import { WebResponse } from '../common/web.model';

@Controller('/api/supplier')
@UseGuards(AdminGuard)
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSupplier(
    @Auth('username') username: string,
    @Body() request: CreateSupplierRequest,
  ): Promise<WebResponse<SupplierResponse>> {
    const supplier = await this.supplierService.createSupplier(
      username,
      request,
    );
    return { data: supplier };
  }

  @Get('/:supplierId')
  @HttpCode(HttpStatus.OK)
  async getSupplier(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<WebResponse<SupplierResponse>> {
    const supplier = await this.supplierService.getSupplier(supplierId);
    return { data: supplier };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllSuppliers(): Promise<WebResponse<SupplierResponse[]>> {
    const suppliers = await this.supplierService.getAllSuppliers();
    return { data: suppliers };
  }

  @Get('/:supplierId/products')
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<WebResponse<SupplierResponse>> {
    const supplier =
      await this.supplierService.getSupplierWithProducts(supplierId);
    return { data: supplier };
  }

  @Patch('/:supplierId')
  @HttpCode(HttpStatus.OK)
  async updateSupplier(
    @Auth('username') username: string,
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() request: UpdateSupplierRequest,
  ): Promise<WebResponse<SupplierResponse>> {
    const supplier = await this.supplierService.updateSupplier(
      username,
      supplierId,
      request,
    );
    return { data: supplier };
  }

  @Delete('/:supplierId')
  @HttpCode(HttpStatus.OK)
  async deleteSupplier(
    @Auth('username') username: string,
    @Param('supplierId', ParseIntPipe) supplierId: number,
  ): Promise<WebResponse<boolean>> {
    await this.supplierService.deleteSupplier(username, supplierId);
    return { data: true };
  }
}
