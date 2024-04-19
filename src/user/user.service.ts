import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserPasswordRequest,
  UpdateUserProfileRequest,
  UserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return this.toUserResponse(user);
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 401);
    }

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException('Invalid username or password', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: uuid(),
      },
    });

    return this.toUserResponse(user);
  }

  async get(user: User): Promise<UserResponse> {
    return this.toUserResponse(user);
  }

  async updateProfile(
    user: User,
    request: UpdateUserProfileRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${user.username}, ${JSON.stringify(request)})`,
    );
    const updateRequest: UpdateUserProfileRequest =
      this.validationService.validate(UserValidation.UPDATE_PROFILE, request);

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: updateRequest,
    });

    return this.toUserResponse(updatedUser);
  }

  async updatePassword(
    user: User,
    request: UpdateUserPasswordRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UserService.updatePassword(${user.username}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateUserPasswordRequest =
      this.validationService.validate(UserValidation.UPDATE_PASSWORD, request);
    const updatedUser = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        password: await bcrypt.hash(updateRequest.new_password, 10),
      },
    });

    return this.toUserResponse(updatedUser);
  }

  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return this.toUserResponse(result);
  }

  async toUserResponse(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      token: user.token,
    };
  }
}
