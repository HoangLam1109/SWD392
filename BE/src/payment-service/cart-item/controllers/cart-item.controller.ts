import {
  Controller,
  Get,
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
import { CartItemService } from '../services/cart-item.service';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItemResponseDto } from '../dto/cart-item-response.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { Role } from '../../../auth/decorators/role.decorator';
import { UserRole } from '../../../user-service/user/enum/user.enum';

@ApiBearerAuth()
@ApiTags('Cart Items')
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiOperation({ summary: 'Get all cart items' })
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
    description: 'Search term',
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
    description: 'Paginated list of cart items',
    type: PaginationResponseDto<CartItemResponseDto>,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  findAllWithPagination(@Query() query: PaginationOptionsDto) {
    return this.cartItemService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get cart items by cart ID' })
  @ApiResponse({
    status: 200,
    description: 'List of cart items for the cart',
    type: [CartItemResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @Get('cart/:cartId')
  findByCartId(@Param('cartId') cartId: string) {
    return this.cartItemService.findCartItemsByCartId(cartId);
  }

  @ApiOperation({ summary: 'Get cart item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cart item found',
    type: CartItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Manager access required',
  })
  @Role(UserRole.ADMIN, UserRole.MANAGER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartItemService.findCartItemById(id);
  }

  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.updateCartItem(id, updateCartItemDto);
  }

  @ApiOperation({ summary: 'Delete cart item' })
  @ApiResponse({
    status: 200,
    description: 'Cart item deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.deleteCartItem(id);
  }
}
