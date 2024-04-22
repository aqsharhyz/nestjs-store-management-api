import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { ShipperModule } from './shipper/shipper.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    CategoryModule,
    SupplierModule,
    ProductModule,
    ShipperModule,
    // OrderModule,
    // AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
