import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from '../../common/services/pagination.service';
import { LibraryGameModule } from '../library-game/library-game.module';
import { GameSessionController } from './controllers/game-session.controller';
import { GameSession, GameSessionSchema } from './entities/game-session.entity';
import { GameSessionRepository } from './repositories/game-session.repository';
import { GameSessionService } from './services/game-session.service';

@Module({
	imports: [
		MongooseModule.forFeature(
			[{ name: GameSession.name, schema: GameSessionSchema }],
			'GAME_DB',
		),
		LibraryGameModule,
	],
	controllers: [GameSessionController],
	providers: [GameSessionService, GameSessionRepository, PaginationService],
	exports: [GameSessionService],
})
export class GameSessionModule {}

