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
import { UserGameItemService } from '../services/user-game-item.service';
import { CreateUserGameItemDto } from '../dto/create-user-game-item.dto';
import { UpdateUserGameItemDto } from '../dto/update-user-game-item.dto';
import { UserGameItemResponseDto } from '../dto/user-game-item-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { GetUser } from 'src/common/decorators/info.decorator';

@ApiTags('User Game Items')
@Controller('user-game-item')
export class UserGameItemController {
  constructor(private readonly userGameItemService: UserGameItemService) {}

  @ApiOperation({ summary: 'Create a new game item' })
  @ApiResponse({
    status: 201,
    description: 'Game item created successfully',
    type: UserGameItemResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createUserGameItemDto: CreateUserGameItemDto) {
    return this.userGameItemService.create(createUserGameItemDto);
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
    type: PaginationResponseDto<UserGameItemResponseDto>,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.userGameItemService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get user game items by user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of user game items for the user',
    type: [UserGameItemResponseDto],
  })
  @Get('me')
  findByUserId(@GetUser() user: Partial<{ id: string }>) {
    return this.userGameItemService.findByUserId(user.id!);
  }

  @ApiOperation({ summary: 'Get user game items by item ID' })
  @ApiParam({ name: 'itemId', description: 'Game Item ID' })
  @ApiResponse({
    status: 200,
    description: 'List of user game items for the item',
    type: [UserGameItemResponseDto],
  })
  @Get('item/:itemId')
  findByItemId(@Param('itemId') itemId: string) {
    return this.userGameItemService.findByItemId(itemId);
  }

  @ApiOperation({ summary: 'Get a user game item by ID' })
  @ApiParam({ name: 'id', description: 'User Game Item ID' })
  @ApiResponse({
    status: 200,
    description: 'User game item details',
    type: UserGameItemResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userGameItemService.findById(id);
  }

  @ApiOperation({ summary: 'Update a user game item' })
  @ApiParam({ name: 'id', description: 'User Game Item ID' })
  @ApiResponse({
    status: 200,
    description: 'User game item updated successfully',
    type: UserGameItemResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserGameItemDto: UpdateUserGameItemDto,
  ) {
    return this.userGameItemService.update(id, updateUserGameItemDto);
  }

  @ApiOperation({ summary: 'Toggle equip/unequip status of a user game item' })
  @ApiParam({ name: 'id', description: 'User Game Item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item equip status toggled successfully',
    type: UserGameItemResponseDto,
  })
  @Patch(':id/equip')
  equipItem(@Param('id') id: string) {
    return this.userGameItemService.equipItem(id);
  }

  @ApiOperation({ summary: 'Delete a user game item' })
  @ApiParam({ name: 'id', description: 'User Game Item ID' })
  @ApiResponse({
    status: 200,
    description: 'User game item deleted successfully',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userGameItemService.remove(id);
  }
}
