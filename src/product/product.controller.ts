import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  FileTypeValidatorOptions,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  MaxFileSizeValidatorOptions,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../common/auth.decorator';
import {
  CreateProductRequest,
  ProductResponse,
  SearchProductRequest,
  updateProductRequest,
} from './product.model';
import { WebResponse } from '../common/web.model';
import { AdminGuard } from '../common/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('/api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @UseGuards(AdminGuard)
  // @UseInterceptors(FileInterceptor('product_image'))
  @UseInterceptors(
    FileInterceptor('product_image', {
      storage: diskStorage({
        destination: './storage/upload/product_images/',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix);
        },
      }),
    }),
  )
  async createProduct(
    // @Auth('username') username: string,
    // @Body() request: CreateProductRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10,
            message: 'Product image must not exceed 10MB',
          } as MaxFileSizeValidatorOptions),
          new FileTypeValidator({
            fileType: /image\/(png|jpg|jpeg)/,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    // ): Promise<WebResponse<ProductResponse>> {
  ) {
    // const product = await this.productService.createProduct(username, request);
    // return {
    //   data: product,
    // };

    return image.stream;
  }

  @Get('/:productId')
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
  async getListProducts(
    @Query('code') code?: string,
    @Query('name') name?: string,
    @Query('description') description?: string,
    // @Query('price', ParseIntPipe) price?: number,
    // @Query('stock', ParseIntPipe) quantityInStock?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
  ): Promise<WebResponse<ProductResponse[]>> {
    const request: SearchProductRequest = {
      code: code,
      name: name,
      description: description,
      // price: price,
      // quantityInStock: quantityInStock,
      page: page,
      size: size,
    };
    return await this.productService.getListProducts(request);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchProduct(
    @Query('q') q: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  ): Promise<WebResponse<ProductResponse[]>> {
    const request = {
      search: q,
      page,
    };
    return await this.productService.simpleSearchProduct(request);
  }

  // @Get()
  // @HttpCode(200)
  // async getAll(
  //   @Auth() user: User,
  //   @Query('title') title?: string,
  //   @Query('author') author?: string,
  //   @Query('publisher') publisher?: string,
  //   @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  //   @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
  //   @Query('size', new ParseIntPipe({ optional: true })) size: number = 10,
  //   @Query('isFinished', new ParseBoolPipe({ optional: true }))
  //   isFinished?: boolean,
  // ): Promise<WebResponse<BookResponse[]>> {
  //   const request: SearchBookRequest = {
  //     title: title,
  //     author: author,
  //     publisher: publisher,
  //     year: year,
  //     page: page,
  //     size: size,
  //     isFinished: isFinished,
  //   };
  //   return await this.bookService.getAll(user, request);
  // }

  @Patch('/:productId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateProduct(
    @Auth('username') username: string,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() request: updateProductRequest,
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
