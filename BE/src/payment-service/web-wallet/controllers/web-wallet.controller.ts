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
import { WebWalletService } from '../services/web-wallet.service';
import { CreateWebWalletDto } from '../dto/create-web-wallet.dto';
import { UpdateWebWalletDto } from '../dto/update-web-wallet.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { GetUser } from 'src/common/decorators/info.decorator';
import { WebWalletResponseDto } from '../dto/web-wallet-response.dto';

@ApiBearerAuth()
@ApiTags('web-wallets')
@Controller('web-wallets')
export class WebWalletController {
  constructor(private readonly webWalletService: WebWalletService) {}

  @ApiOperation({ summary: 'Create a new web wallet' })
  @ApiResponse({
    status: 201,
    description: 'Web wallet created successfully',
    type: WebWalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createWebWalletDto: CreateWebWalletDto) {
    return this.webWalletService.create(createWebWalletDto);
  }

  @ApiOperation({ summary: 'Get all web wallets with pagination' })
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
    description: 'List of all web wallets with pagination',
    type: PaginationResponseDto<WebWalletResponseDto>,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.webWalletService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get web wallet by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Web wallet found',
    type: WebWalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Web wallet not found',
  })
  @Get('me')
  findOneByUserId(@GetUser() user: Partial<{ _id: string }>) {
    return this.webWalletService.findWalletByUserId(user._id!);
  }

  @ApiOperation({ summary: 'Get web wallet by ID' })
  @ApiResponse({
    status: 200,
    description: 'Web wallet found',
    type: WebWalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Web wallet not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webWalletService.findWalletById(id);
  }

  @ApiOperation({ summary: 'Update web wallet' })
  @ApiResponse({
    status: 200,
    description: 'Web wallet updated successfully',
    type: WebWalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Web wallet not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWebWalletDto: UpdateWebWalletDto,
  ) {
    return this.webWalletService.updateWallet(id, updateWebWalletDto);
  }

  @ApiOperation({ summary: 'Delete web wallet' })
  @ApiResponse({
    status: 200,
    description: 'Web wallet deleted successfully',
    type: WebWalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Web wallet not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webWalletService.deleteWallet(id);
  }
}
