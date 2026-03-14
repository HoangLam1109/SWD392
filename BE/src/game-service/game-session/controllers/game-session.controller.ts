import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiParam,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { CreateGameSessionDto } from '../dto/create-game-session.dto';
import { EndGameSessionDto } from '../dto/end-game-session.dto';
import { GameSessionResponseDto } from '../dto/game-session.response';
import { UpdateGameSessionDto } from '../dto/update-game-session.dto';
import { GameSessionService } from '../services/game-session.service';

@ApiBearerAuth()
@ApiTags('Game Sessions')
@Controller('game-session')
export class GameSessionController {
	constructor(private readonly gameSessionService: GameSessionService) {}

	@ApiOperation({ summary: 'Create a game session' })
	@ApiResponse({
		status: 201,
		description: 'Game session created successfully',
		type: GameSessionResponseDto,
	})
	@ApiParam({
		name: 'libraryGameId',
		description: 'Library game Mongo id',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	@Post('library-game/:libraryGameId')
	create(
		@Param('libraryGameId') libraryGameId: string,
		@Body() createGameSessionDto: CreateGameSessionDto,
	) {
		return this.gameSessionService.create(libraryGameId, createGameSessionDto);
	}

	@ApiOperation({ summary: 'Start playing (create a new running session)' })
	@ApiResponse({
		status: 201,
		description: 'Session started successfully',
		type: GameSessionResponseDto,
	})
	@ApiParam({
		name: 'libraryGameId',
		description: 'Library game Mongo id',
		example: '67d0f5ca8fa4f25a819f2a95',
	})
	@Post('play/library-game/:libraryGameId')
	play(@Param('libraryGameId') libraryGameId: string) {
		return this.gameSessionService.play(libraryGameId);
	}

	@ApiOperation({ summary: 'Get all game sessions with pagination' })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@ApiQuery({ name: 'sortBy', required: false, type: String })
	@ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
	@ApiQuery({ name: 'cursor', required: false, type: String })
	@ApiQuery({ name: 'search', required: false, type: String })
	@ApiQuery({ name: 'searchField', required: false, type: String })
	@ApiResponse({
		status: 200,
		description: 'List of game sessions with pagination',
		type: PaginationResponseDto<GameSessionResponseDto>,
	})
	@Get()
	findAll(@Query() query: PaginationOptionsDto) {
		return this.gameSessionService.findAllWithPagination(query);
	}

	@ApiOperation({ summary: 'Get game session by id' })
	@ApiResponse({
		status: 200,
		description: 'Game session found',
		type: GameSessionResponseDto,
	})
	@ApiResponse({
		status: 404,
		description: 'Game session not found',
	})
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.gameSessionService.findOne(id);
	}

	@ApiOperation({ summary: 'End a game session and update highest score if needed' })
	@ApiResponse({
		status: 200,
		description: 'Session ended successfully',
		type: GameSessionResponseDto,
	})
	@Patch(':id/end')
	end(@Param('id') id: string, @Body() endGameSessionDto: EndGameSessionDto) {
		return this.gameSessionService.end(id, endGameSessionDto);
	}

	@ApiOperation({ summary: 'Update game session' })
	@ApiResponse({
		status: 200,
		description: 'Game session updated successfully',
		type: GameSessionResponseDto,
	})
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateGameSessionDto: UpdateGameSessionDto,
	) {
		return this.gameSessionService.update(id, updateGameSessionDto);
	}

	@ApiOperation({ summary: 'Delete game session' })
	@ApiResponse({
		status: 200,
		description: 'Game session deleted successfully',
	})
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.gameSessionService.remove(id);
	}
}

