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
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { GameService } from '../services/game.service';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
<<<<<<< HEAD
import { Role } from '../../../auth/decorators/role.decorator';
import { UserRole } from '../../../user-service/user/enum/user.enum';
=======
>>>>>>> parent of 4376748 (Merge branch 'dev' of https://github.com/HoangLam1109/SWD392 into feature/update-login)

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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for game titles',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc/desc)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of games',
    type: PaginationResponseDto<GameResponseDto>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @Get()
  findAllWithPagination(@Query() query: PaginationOptionsDto) {
    return this.gameService.findAllWithPagination(query);
  }

<<<<<<< HEAD
  @ApiOperation({ summary: 'Index all games' })
  @ApiResponse({
    status: 200,
    description: 'Games indexed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Get('index')
  indexAllGames() {
    return this.gameService.findAllForIndexing();
  }

  @ApiOperation({ summary: 'Get game by category ID' })
  @ApiResponse({
    status: 200,
    description: 'Game found',
    type: [GameResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
  })
  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: string) {
    return this.gameService.findGameByCategoryId(categoryId);
  }

=======
>>>>>>> parent of 4376748 (Merge branch 'dev' of https://github.com/HoangLam1109/SWD392 into feature/update-login)
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
