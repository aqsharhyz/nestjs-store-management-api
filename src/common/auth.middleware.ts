import { Injectable, NestMiddleware, ParseUUIDPipe } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const token = req.headers['authorization'];
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token: token,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
