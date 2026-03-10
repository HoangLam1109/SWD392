import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GameKeyService } from '../services/game-key.service';
import { CreateGameKeyDto } from '../dto/create-game-key.dto';
import { UpdateGameKeyDto } from '../dto/update-game-key.dto';
import { GameKeyResponseDto } from '../dto/game-key-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';

@ApiTags('Game Keys')
@Controller('game-key')
export class GameKeyController {
  constructor(private readonly gameKeyService: GameKeyService) {}

  @ApiOperation({ summary: 'Create a new game key' })
  @ApiResponse({
    status: 201,
    description: 'Game key created successfully',
    type: GameKeyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createGameKeyDto: CreateGameKeyDto) {
    return this.gameKeyService.create(createGameKeyDto);
  }

  @ApiOperation({ summary: 'Get all game keys with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by (default: _id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'searchField',
    required: false,
    type: String,
    description: 'Field to search in',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all game keys with pagination',
    type: PaginationResponseDto<GameKeyResponseDto>,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.gameKeyService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get game keys by game ID' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiResponse({
    status: 200,
    description: 'List of game keys for the game',
    type: [GameKeyResponseDto],
  })
  @Get('/game/:gameId')
  findByGameId(@Param('gameId') gameId: string) {
    return this.gameKeyService.findByGameId(gameId);
  }

  @ApiOperation({ summary: 'Get available game keys by game ID' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  @ApiResponse({
    status: 200,
    description: 'List of available game keys for the game',
    type: [GameKeyResponseDto],
  })
  @Get('/game/:gameId/available')
  findAvailableKeys(@Param('gameId') gameId: string) {
    return this.gameKeyService.findAvailableKeys(gameId);
  }

  @ApiOperation({ summary: 'Get game key by ID' })
  @ApiParam({ name: 'id', description: 'Game Key ID' })
  @ApiResponse({
    status: 200,
    description: 'Game key details',
    type: GameKeyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game key not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameKeyService.findById(id);
  }

  @ApiOperation({ summary: 'Update a game key' })
  @ApiParam({ name: 'id', description: 'Game Key ID' })
  @ApiResponse({
    status: 200,
    description: 'Game key updated successfully',
    type: GameKeyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game key not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameKeyDto: UpdateGameKeyDto) {
    return this.gameKeyService.update(id, updateGameKeyDto);
  }

  @ApiOperation({ summary: 'Assign a game key to an order detail' })
  @ApiParam({ name: 'keyCode', description: 'Game Key Code' })
  @ApiResponse({
    status: 200,
    description: 'Game key assigned successfully',
    type: GameKeyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game key not found or already assigned',
  })
  @Patch('/assign/:keyCode')
  assignKey(
    @Param('keyCode') keyCode: string,
    @Body('orderDetailId') orderDetailId: string,
  ) {
    return this.gameKeyService.assignKey(keyCode, orderDetailId);
  }

  @ApiOperation({ summary: 'Activate a game key (mark as used)' })
  @ApiParam({ name: 'keyCode', description: 'Game Key Code' })
  @ApiResponse({
    status: 200,
    description: 'Game key activated successfully',
    type: GameKeyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game key not found or not assigned',
  })
  @Patch('/activate/:keyCode')
  activateKey(@Param('keyCode') keyCode: string) {
    return this.gameKeyService.activateKey(keyCode);
  }

  @ApiOperation({ summary: 'Delete a game key' })
  @ApiParam({ name: 'id', description: 'Game Key ID' })
  @ApiResponse({
    status: 200,
    description: 'Game key deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game key not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameKeyService.remove(id);
  }
}
