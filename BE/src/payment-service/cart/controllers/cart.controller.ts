import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CartService } from '../services/cart.service';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CartResponseDto } from '../dto/cart-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { GetUser } from '../../../common/decorators/info.decorator';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get all carts' })
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
    description: 'Paginated list of carts',
    type: PaginationResponseDto<CartResponseDto>,
  })
  @Get()
  findAllWithPagination(@Query() query: PaginationOptionsDto) {
    return this.cartService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get my cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart found',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Get('me')
  getMyCart(@GetUser() user: Partial<{ _id: string }>) {
    return this.cartService.findCartByUserId(user._id!);
  }

  @ApiOperation({ summary: 'Add game to cart' })
  @ApiResponse({
    status: 200,
    description: 'Game added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Patch('me/add/:productId')
  addGameToCart(
    @GetUser() user: Partial<{ _id: string }>,
    @Param('productId') productId: string,
  ) {
    return this.cartService.addItemToCart(user._id!, productId);
  }

  @ApiOperation({ summary: 'Remove game from cart' })
  @ApiResponse({
    status: 200,
    description: 'Game removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Patch('me/remove/:productId')
  removeGameFromCart(
    @GetUser() user: Partial<{ _id: string }>,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItemFromCart(user._id!, productId);
  }

  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Patch('me/clear')
  clearAll(@GetUser() user: Partial<{ _id: string }>) {
    return this.cartService.clearAll(user._id!);
  }

  @ApiOperation({ summary: 'Get cart by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart found',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findCartById(id);
  }

  @ApiOperation({ summary: 'Update cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.updateCart(id, updateCartDto);
  }

  @ApiOperation({ summary: 'Delete cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.deleteCart(id);
  }
}
