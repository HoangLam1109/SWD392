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
import { OrderDetailService } from '../services/order-detail.service';
import { CreateOrderDetailDto } from '../dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from '../dto/update-order-detail.dto';
import { OrderDetailResponseDto } from '../dto/order-detail-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';

@ApiBearerAuth()
@ApiTags('Order Details')
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @ApiOperation({ summary: 'Create a new order detail' })
  @ApiResponse({
    status: 201,
    description: 'Order detail created successfully',
    type: OrderDetailResponseDto,
  })
  @Post()
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.createOrderDetail(createOrderDetailDto);
  }

  @ApiOperation({ summary: 'Get all order details with pagination' })
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
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
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
    description: 'Order details retrieved successfully',
    type: PaginationResponseDto<OrderDetailResponseDto>,
  })
  @Get()
  findAllWithPagination(@Query() query: PaginationOptionsDto) {
    return this.orderDetailService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get order details by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
    type: [OrderDetailResponseDto],
  })
  @Get('order/:orderId')
  findByOrderId(@Param('orderId') orderId: string) {
    return this.orderDetailService.findOrderDetailsByOrderId(orderId);
  }

  @ApiOperation({ summary: 'Get order detail by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order detail retrieved successfully',
    type: OrderDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order detail not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOrderDetailById(id);
  }

  @ApiOperation({ summary: 'Update order detail' })
  @ApiResponse({
    status: 200,
    description: 'Order detail updated successfully',
    type: OrderDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order detail not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.updateOrderDetail(id, updateOrderDetailDto);
  }

  @ApiOperation({ summary: 'Delete order detail' })
  @ApiResponse({
    status: 200,
    description: 'Order detail deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order detail not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.deleteOrderDetail(id);
  }

  @ApiOperation({ summary: 'Delete all order details by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order details deleted successfully',
  })
  @Delete('order/:orderId')
  removeByOrderId(@Param('orderId') orderId: string) {
    return this.orderDetailService.deleteOrderDetailsByOrderId(orderId);
  }
}
