import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { OrderModule } from './orders/order.module';
import { ProductModule } from './products/product.module';
import { PaymentModule } from './payments/payment.module';
import { UsersModule } from './users/users.module';
import { TableModule } from './tables/table.module';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { Restaurant } from './restaurants/restaurant.entity';
import { Table } from './tables/table.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ProductOptionsModule } from './product-options/product-options.module';
import { ProductOption } from './product-options/product-options.entity';
import { ProductOptionValue } from './product-option-values/product-option-values.entity';
import { ProductOptionValuesModule } from './product-option-values/product-option-values.module';
import { FirebaseAdminModule } from './firebase/firebase-admin.module';
import { TableSessionModule } from './table-sessions/table-session.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // lee .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get('DB_HOST', 'localhost'),
        port: +cfg.get('DB_PORT', 3306),
        username: cfg.get('DB_USER', 'root'),
        password: cfg.get('DB_PASSWORD', 'secret'),
        database: cfg.get('DB_NAME', 'orderpaydb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: cfg.get('DB_SYNC', 'true') === 'true', // El primer true se usa solo para dev
        charset: 'utf8mb4_unicode_ci',
        timezone: 'Z',
        extra: { connectionLimit: 10 }, // pool
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FirebaseAdminModule,
    OrderModule,
    ProductModule,
    RestaurantsModule,
    ProductOptionsModule,
    ProductOptionValuesModule,
    TableSessionModule,
    PaymentModule,
    TableModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
