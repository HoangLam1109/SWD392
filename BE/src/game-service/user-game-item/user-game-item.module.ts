import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGameItemService } from './services/user-game-item.service';
import { UserGameItemController } from './controllers/user-game-item.controller';
import { UserGameItemRepository } from './repositories/user-game-item.repository';
import {
  UserGameItem,
  UserGameItemSchema,
} from './entities/user-game-item.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: UserGameItem.name, schema: UserGameItemSchema }],
      'GAME_DB',
    ),
  ],
  controllers: [UserGameItemController],
  providers: [UserGameItemService, UserGameItemRepository, PaginationService],
  exports: [UserGameItemService],
})
export class UserGameItemModule {}
