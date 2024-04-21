import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
} from './user.model';
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
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const totalUserWithSameEmail = await this.prismaService.user.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return await this.login({
      username: user.username,
      password: request.password,
    });
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
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
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
    username: string,
    request: UpdateUserProfileRequest,
  ): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${username}, ${JSON.stringify(request)})`,
    );

    const updateRequest: UpdateUserProfileRequest =
      this.validationService.validate(UserValidation.UPDATE_PROFILE, request);

    const updatedUser = await this.prismaService.user.update({
      where: {
        username: username,
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

    if (!(await bcrypt.compare(updateRequest.old_password, user.password))) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

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

  async logout(username: string): Promise<UserResponse> {
    this.logger.debug(`UserService.logout(${username})`);

    const result = await this.prismaService.user.update({
      where: {
        username: username,
      },
      data: {
        token: null,
      },
    });

    return this.toUserResponse(result);
  }

  async getAllUser() {}

  async getAllAdmin() {}

  async adminUpdateUser() {}

  async promoteToAdmin() {}

  async forgotPassword() {}

  async resetPassword() {}

  async deleteUser() {}

  async adminDeleteUser() {}

  toUserResponse(user: User): UserResponse {
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }
}
