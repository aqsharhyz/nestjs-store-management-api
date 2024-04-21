import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import * as winston from 'winston';
import { AuthMiddleware } from './auth.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AdminGuard } from './admin.guard';
import { SeederService } from '../../test/seeder/seeder.service';
import { SeederModule } from '../../test/seeder/seeder.module';
// import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SeederModule,
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    SeederService,
  ],
  exports: [
    PrismaService,
    ValidationService,
    // { provide: APP_GUARD, useClass: AdminGuard },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
