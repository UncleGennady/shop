import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import {ConfigModule} from '@nestjs/config'
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ReviewResponseModule } from './review-response/review-response.module';
 
@Module({
  imports: [ ConfigModule.forRoot(), AuthModule, UserModule, CategoryModule, OrderModule, ProductModule, ReviewResponseModule],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
   
  ],
})
export class AppModule {}
