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
import { SystemRequirementService } from '../services/system_requirement.service';
import { CreateSystemRequirementDto } from '../dto/create-system_requirement.dto';
import { UpdateSystemRequirementDto } from '../dto/update-system_requirement.dto';
import { SystemRequirementResponseDto } from '../dto/system_requirement-response.dto';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@ApiBearerAuth()
@ApiTags('system-requirements')
@Controller('system-requirements')
export class SystemRequirementController {
  constructor(
    private readonly systemRequirementService: SystemRequirementService,
  ) {}

  @ApiOperation({ summary: 'Create a new system requirement' })
  @ApiResponse({
    status: 201,
    description: 'System requirement created successfully',
    type: SystemRequirementResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createSystemRequirementDto: CreateSystemRequirementDto) {
    return this.systemRequirementService.create(createSystemRequirementDto);
  }

  @ApiOperation({ summary: 'Get all system requirements with pagination' })
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
    description: 'List of all system requirements with pagination',
    type: PaginationResponseDto,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.systemRequirementService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get system requirements by game ID' })
  @ApiResponse({
    status: 200,
    description: 'List of system requirements for game',
    type: [SystemRequirementResponseDto],
  })
  @Get('game/:gameId')
  findByGameId(@Param('gameId') gameId: string) {
    return this.systemRequirementService.findByGameId(gameId);
  }

  @ApiOperation({ summary: 'Get system requirement by ID' })
  @ApiResponse({
    status: 200,
    description: 'System requirement found',
    type: SystemRequirementResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'System requirement not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemRequirementService.findById(id);
  }

  @ApiOperation({ summary: 'Update system requirement' })
  @ApiResponse({
    status: 200,
    description: 'System requirement updated successfully',
    type: SystemRequirementResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'System requirement not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemRequirementDto: UpdateSystemRequirementDto,
  ) {
    return this.systemRequirementService.update(
      id,
      updateSystemRequirementDto,
    );
  }

  @ApiOperation({ summary: 'Delete system requirement' })
  @ApiResponse({
    status: 200,
    description: 'System requirement deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'System requirement not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemRequirementService.remove(id);
  }
}
