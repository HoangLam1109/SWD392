import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { GetUser } from '../../../common/decorators/info.decorator';
import { Role } from '../../../auth/decorators/role.decorator';
import { UserRole } from '../../../user-service/user/enum/user.enum';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto.userId, createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders with pagination' })
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
    description: 'List of all orders with pagination',
    type: PaginationResponseDto<OrderResponseDto>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.orderService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOrderById(id);
  }

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
  })
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Orders found for the user',
    type: [OrderResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Orders not found for this user',
  })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.orderService.findOrdersByUserId(userId);
  }

  @ApiOperation({ summary: 'Checkout and create order for user' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully after checkout',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order details not found',
  })
  @Post('checkout')
  checkout(@GetUser() user: Partial<{ _id: string }>) {
    return this.orderService.checkout(user._id!);
  }
}
