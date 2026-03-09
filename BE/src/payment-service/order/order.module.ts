import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrderDetailModule } from '../order-detail/order-detail.module';
import { Order, OrderSchema } from './entities/order.entity';
import { PaginationService } from 'src/common/services/pagination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from '../transaction/transaction.module';
import { CartModule } from '../cart/cart.module';
import { UserGameItemModule } from '../../game-service/user-game-item/user-game-item.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'PAYMENT_DB',
    ),
    OrderDetailModule,
    TransactionModule,
    CartModule,
    UserGameItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, PaginationService],
  exports: [OrderService],
})
export class OrderModule {}
