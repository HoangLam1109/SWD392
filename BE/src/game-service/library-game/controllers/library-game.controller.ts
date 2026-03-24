import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { CreateLibraryGameDto } from '../dto/create-library-game.dto';
import { LibraryGameLeaderboardResponseDto } from '../dto/library-game-leaderboard.response';
import { LibraryGameResponseDto } from '../dto/library-game.response';
import { UpdateLibraryGameDto } from '../dto/update-library-game.dto';
import { LibraryGameService } from '../services/library-game.service';
import { Role } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user-service/user/enum/user.enum';
import { GetUser } from 'src/common/decorators/info.decorator';

@ApiBearerAuth()
@ApiTags('Library Games')
@Controller('library-game')
export class LibraryGameController {
  constructor(private readonly libraryGameService: LibraryGameService) {}

  @ApiOperation({ summary: 'Create a new library game record' })
  @ApiResponse({
    status: 201,
    description: 'Library game created successfully',
    type: LibraryGameResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createLibraryGameDto: CreateLibraryGameDto) {
    return this.libraryGameService.create(createLibraryGameDto);
  }

  @ApiOperation({ summary: 'Get library game records with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'searchField', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of library game records with pagination',
    type: PaginationResponseDto<LibraryGameResponseDto>,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.libraryGameService.findAllWithPagination(query);
  }

  @ApiOperation({
    summary:
      'Get leaderboard by highest score (one best record per different user)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of ranked users to return (default: 10, max: 100)',
  })
  @ApiQuery({
    name: 'game_id',
    required: false,
    type: String,
    description: 'Filter leaderboard for a specific game id',
  })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard sorted by highest score across distinct users',
    type: [LibraryGameLeaderboardResponseDto],
  })
  @Get('leaderboard/highest-score')
  getHighestScoreLeaderboard(
    @Query('limit') limit?: number,
    @Query('game_id') game_id?: string,
  ) {
    return this.libraryGameService.getHighestScoreLeaderboard(
      Number(limit),
      game_id,
    );
  }

  @ApiOperation({ summary: 'Get library game record by id' })
  @ApiResponse({
    status: 200,
    description: 'Library game found',
    type: LibraryGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Library game not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryGameService.findOne(id);
  }

  @ApiOperation({ summary: "Get user's highest score across all games" })
  @ApiResponse({
    status: 200,
    description: "User's highest score found",
    type: LibraryGameResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No games found for user',
  })
  @Get('user/highest-score')
  getHighestScoreByUser(@GetUser() user: Partial<{ _id: string }>) {
    return this.libraryGameService.getHighestScoreByUserId(user._id!);
  }

  @ApiOperation({ summary: 'Update library game record' })
  @ApiResponse({
    status: 200,
    description: 'Library game updated successfully',
    type: LibraryGameResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLibraryGameDto: UpdateLibraryGameDto,
  ) {
    return this.libraryGameService.update(id, updateLibraryGameDto);
  }

  @ApiOperation({ summary: 'Delete library game record' })
  @ApiResponse({
    status: 200,
    description: 'Library game deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryGameService.remove(id);
  }
}
