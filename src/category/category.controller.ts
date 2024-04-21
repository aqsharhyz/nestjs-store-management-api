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
import { CategoryService } from './category.service';
import { Auth } from '../common/auth.decorator';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.model';
import { WebResponse } from '../common/web.model';
import { AdminGuard } from '../common/admin.guard';

@Controller('/api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  async createCategory(
    @Auth('username') username: string,
    @Body() request: CreateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const category = await this.categoryService.createCategory(
      username,
      request,
    );
    return { data: category };
  }

  @Get('/:categoryId')
  @HttpCode(HttpStatus.OK)
  async getCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<CategoryResponse>> {
    const category = await this.categoryService.getCategory(categoryId);
    return { data: category };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<WebResponse<CategoryResponse[]>> {
    const categories = await this.categoryService.getAllCategories();
    return { data: categories };
  }

  @Get('/:categoryId/products')
  @HttpCode(HttpStatus.OK)
  async getCategoryWithProducts(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<CategoryResponse>> {
    const category =
      await this.categoryService.getCategoryWithProducts(categoryId);
    return { data: category };
  }

  @Patch('/:categoryId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateCategory(
    @Auth('username') username: string,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const category = await this.categoryService.updateCategory(
      username,
      categoryId,
      request,
    );
    return { data: category };
  }

  @Delete('/:categoryId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async deleteCategory(
    @Auth('username') username: string,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<WebResponse<CategoryResponse>> {
    const category = await this.categoryService.removeCategory(
      username,
      categoryId,
    );
    return { data: category };
  }
}
