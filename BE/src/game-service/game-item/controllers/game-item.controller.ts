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
import { GameItemService } from '../services/game-item.service';
import { CreateGameItemDto } from '../dto/create-game-item.dto';
import { UpdateGameItemDto } from '../dto/update-game-item.dto';
import { GameItemResponseDto } from '../dto/game-item-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';

@ApiBearerAuth()
@ApiTags('Game Items')
@Controller('game-item')
export class GameItemController {
  constructor(private readonly gameItemService: GameItemService) {}

  @ApiOperation({ summary: 'Create a new game item' })
  @ApiResponse({
    status: 201,
    description: 'Game item created successfully',
    type: GameItemResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createGameItemDto: CreateGameItemDto) {
    return this.gameItemService.create(createGameItemDto);
  }

  @ApiOperation({ summary: 'Get all game items with pagination' })
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
    description: 'List of all game items with pagination',
    type: PaginationResponseDto<GameItemResponseDto>,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.gameItemService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get game item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Game item found',
    type: GameItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game item not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameItemService.findOne(id);
  }

  @ApiOperation({ summary: 'Update game item' })
  @ApiResponse({
    status: 200,
    description: 'Game item updated successfully',
    type: GameItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Game item not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameItemDto: UpdateGameItemDto,
  ) {
    return this.gameItemService.update(id, updateGameItemDto);
  }

  @ApiOperation({ summary: 'Delete game item' })
  @ApiResponse({
    status: 200,
    description: 'Game item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Game item not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameItemService.remove(id);
  }
}
