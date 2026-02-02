import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GameService } from './services/game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameResponseDto } from './dto/game-response.dto';

@ApiBearerAuth()
@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'List of all games',
    type: [GameResponseDto],
  })
  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @ApiOperation({ summary: 'Get game by ID' })
  @ApiResponse({
    status: 200,
    description: 'Game found',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findGameById(id);
  }

  @ApiOperation({ summary: 'Get game by release date' })
  @ApiResponse({
    status: 200,
    description: 'Game found',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Get(':releaseDate')
  findByReleaseDate(@Param('releaseDate') releaseDate: Date) {
    return this.gameService.findGameByReleaseDate(releaseDate);
  }

  @ApiOperation({ summary: 'Get game by price' })
  @ApiResponse({
    status: 200,
    description: 'Game found',
    type: GameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Get(':price')
  findByPrice(@Param('price') price: number) {
    return this.gameService.findByPrice(price);
  }

  @ApiOperation({ summary: 'Update game' })
  @ApiResponse({
    status: 200,
    description: 'Game updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.updateGame(id, updateGameDto);
  }

  @ApiOperation({ summary: 'Delete game' })
  @ApiResponse({
    status: 200,
    description: 'Game deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }
}
