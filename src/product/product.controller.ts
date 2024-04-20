import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/common/auth.decorator';
import {
  CreateProductRequest,
  ProductResponse,
  updateProductRequest,
} from './product.model';
import { WebResponse } from 'src/common/web.model';
import { AdminGuard } from 'src/common/admin.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  async createProduct(
    @Auth('username') username: string,
    request: CreateProductRequest,
  ): Promise<WebResponse<ProductResponse>> {
    const product = await this.productService.createProduct(username, request);
    return {
      data: product,
    };
  }

  @Get('/productId')
  @HttpCode(HttpStatus.OK)
  async getProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<WebResponse<ProductResponse>> {
    const product = await this.productService.getProduct(productId);
    return {
      data: product,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getListProducts() {}

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchProduct() {}

  @Patch('/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateProduct(
    @Auth('username') username: string,
    @Param('productId', ParseIntPipe) productId: number,
    request: updateProductRequest,
  ): Promise<WebResponse<ProductResponse>> {
    const product = await this.productService.updateProduct(
      username,
      productId,
      request,
    );
    return {
      data: product,
    };
  }

  @Delete('/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async deleteProduct(
    @Auth('username') username: string,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<WebResponse<boolean>> {
    await this.productService.removeProduct(username, productId);
    return {
      data: true,
    };
  }
}
