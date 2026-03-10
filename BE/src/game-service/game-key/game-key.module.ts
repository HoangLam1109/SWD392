import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameKeyService } from './services/game-key.service';
import { GameKeyController } from './controllers/game-key.controller';
import { GameKeyRepository } from './repositories/game-key.repository';
import { GameKey, GameKeySchema } from './entities/game-key.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: GameKey.name, schema: GameKeySchema }],
      'GAME_DB',
    ),
  ],
  controllers: [GameKeyController],
  providers: [GameKeyService, GameKeyRepository, PaginationService],
  exports: [GameKeyService],
})
export class GameKeyModule {}
