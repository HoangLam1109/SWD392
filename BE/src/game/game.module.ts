import { Module } from '@nestjs/common';
import { GameService } from './services/game.service';
import { GameController } from './game.controller';
import { GameRepository } from './repositories/game.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './entities/game.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Game.name, schema: GameSchema }],
      'GAME_DB',
    ),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}
