import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import * as winston from 'winston';
import { AuthMiddleware } from './auth.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
// import { AdminGuard } from './admin.guard';
// import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.printf(({ level, message, timestamp, ms }) => {
              return `${timestamp} |${ms}| [${level}] ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'dev/logs/error.log',
          level: 'error',
          handleExceptions: true,
          handleRejections: true,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.printf(({ level, message, timestamp, ms }) => {
              return `${timestamp} |${ms}| [${level}] ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'dev/logs/app.log',
          level: 'debug',
          handleExceptions: true,
          handleRejections: true,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.printf(({ level, message, timestamp, ms }) => {
              return `${timestamp} |${ms}| [${level}] ${message}`;
            }),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // SeederModule,
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AdminGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // SeederService,
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
