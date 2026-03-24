import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { CartRepository } from './repositories/cart.repository';
import { PaginationService } from 'src/common/services/pagination.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './entities/cart.entity';
import { CartItemModule } from '../cart-item/cart-item.module';
import { GameModule } from 'src/game-service/game/game.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Cart.name, schema: CartSchema }],
      'PAYMENT_DB',
    ),
    GameModule,
    CartItemModule,
  ],
  controllers: [CartController],
  providers: [CartService, PaginationService, CartRepository],
})
export class CartModule {}
