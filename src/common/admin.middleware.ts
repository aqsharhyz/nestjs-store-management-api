import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
