import { Module } from '@nestjs/common';
import { GameItemService } from './services/game-item.service';
import { GameItemController } from './controllers/game-item.controller';
import { GameItemRepository } from './repositories/game-item.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { GameItem, GameItemSchema } from './entities/game-item.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: GameItem.name, schema: GameItemSchema }],
      'GAME_DB',
    ),
  ],
  controllers: [GameItemController],
  providers: [GameItemService, GameItemRepository, PaginationService],
  exports: [GameItemService],
})
export class GameItemModule {}
