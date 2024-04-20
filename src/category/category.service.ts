import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { CategoryResponse, CreateCategoryRequest } from './category.model';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private categoryService: CategoryService,
    private validationService: ValidationService,
  ) {}

    async createCategory(username: string, createCategoryRequest: CreateCategoryRequest): Promise<CategoryResponse> {
        this.logger.debug(`Creating category: Admin: ${username}, Request: ${JSON.stringify(createCategoryRequest)}`);

        const createRequest = this.validationService.validate(this.validationService.CREATE, createCategoryRequest);

}
