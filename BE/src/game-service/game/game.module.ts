import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameController } from './controllers/game.controller';
import { GameRepository } from './repositories/game.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './entities/game.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Game.name, schema: GameSchema }],
      'GAME_DB',
    ),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository, PaginationService],
  exports: [GameService],
})
export class GameModule {}
