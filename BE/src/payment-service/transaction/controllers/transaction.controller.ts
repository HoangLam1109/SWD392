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
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';

@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @ApiOperation({ summary: 'Get all transactions with pagination' })
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
    description: 'List of all transactions with pagination',
    type: PaginationResponseDto,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.transactionService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findTransactionById(id);
  }

  @ApiOperation({ summary: 'Get transaction by reference ID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @Get('ref/:refId')
  findByRefId(@Param('refId') refId: string) {
    return this.transactionService.findByRefId(refId);
  }

  @ApiOperation({ summary: 'Get transactions by wallet ID' })
  @ApiResponse({
    status: 200,
    description: 'Transactions found',
  })
  @Get('wallet/:walletId')
  findByWalletId(@Param('walletId') walletId: string) {
    return this.transactionService.findByWalletId(walletId);
  }

  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(id, updateTransactionDto);
  }

  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(id);
  }
}
