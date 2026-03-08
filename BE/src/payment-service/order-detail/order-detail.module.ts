import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailService } from './services/order-detail.service';
import { OrderDetailController } from './controllers/order-detail.controller';
import { OrderDetailRepository } from './repositories/order-detail.repository';
import { OrderDetail, OrderDetailSchema } from './entities/order-detail.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { ProductValidationService } from '../../common/services/productValidation.service';
import { GameModule } from 'src/game-service/game/game.module';
import { CartModule } from 'src/payment-service/cart/cart.module';
import { CartItemModule } from 'src/payment-service/cart-item/cart-item.module';
import { GameItemModule } from 'src/game-service/game-item/game-item.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: OrderDetail.name, schema: OrderDetailSchema }],
      'PAYMENT_DB',
    ),
    CartModule,
    CartItemModule,
    GameModule,
    GameItemModule,
  ],
  controllers: [OrderDetailController],
  providers: [
    OrderDetailService,
    OrderDetailRepository,
    PaginationService,
    ProductValidationService,
  ],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
