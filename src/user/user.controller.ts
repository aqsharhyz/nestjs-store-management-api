import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  RegisterUserRequest,
  UpdateUserProfileRequest,
  UpdateUserPasswordRequest,
  UserResponse,
} from './user.model';
import { WebResponse } from '../common/web.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);
    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);
    return {
      data: result,
    };
  }

  @Patch('/current')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth('username') username: string,
    @Body() request: UpdateUserProfileRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updateProfile(username, request);
    return {
      data: result,
    };
  }

  @Patch('/current/password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Auth() user: User,
    @Body() request: UpdateUserPasswordRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.updatePassword(user, request);
    return {
      data: result,
    };
  }

  @Delete('/current')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Auth('username') username: string,
  ): Promise<WebResponse<boolean>> {
    await this.userService.logout(username);
    return {
      data: true,
    };
  }
}
