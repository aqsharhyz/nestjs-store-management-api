import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const Admin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === 'admin') {
      return user;
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  },
);
