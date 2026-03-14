import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from '../../common/services/pagination.service';
import { UserModule } from '../../user-service/user/user.module';
import { GameModule } from '../game/game.module';
import { GameKeyModule } from '../game-key/game-key.module';
import { LibraryGameController } from './controllers/library-game.controller';
import { LibraryGame, LibraryGameSchema } from './entites/library-game.entity';
import { LibraryGameRepository } from './repositories/library-game.repository';
import { LibraryGameService } from './services/library-game.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LibraryGame.name, schema: LibraryGameSchema }],
      'GAME_DB',
    ),
    UserModule,
    GameModule,
    GameKeyModule,
  ],
  controllers: [LibraryGameController],
  providers: [LibraryGameService, LibraryGameRepository, PaginationService],
  exports: [LibraryGameService],
})
export class LibraryGameModule {}
