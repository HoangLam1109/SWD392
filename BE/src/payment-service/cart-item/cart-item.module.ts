import { Module } from '@nestjs/common';
import { CartItemService } from './services/cart-item.service';
import { CartItemController } from './controllers/cart-item.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartItem, CartItemSchema } from './entities/cart-item.entity';
import { CartItemRepository } from './repositories/cart-item.repository';
import { PaginationService } from 'src/common/services/pagination.service';
import { ProductValidationService } from 'src/common/services/productValidation.service';
import { GameModule } from 'src/game-service/game/game.module';
import { GameItemModule } from 'src/game-service/game-item/game-item.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CartItem.name, schema: CartItemSchema }],
      'PAYMENT_DB',
    ),
    GameModule,
    GameItemModule,
  ],
  controllers: [CartItemController],
  providers: [
    CartItemService,
    CartItemRepository,
    PaginationService,
    ProductValidationService,
  ],
  exports: [CartItemService],
})
export class CartItemModule {}
