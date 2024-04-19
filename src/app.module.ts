import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [CommonModule, UserModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
