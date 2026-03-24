import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CartRepository } from '../repositories/cart.repository';
import { CartDocument } from '../entities/cart.entity';
import { CartItemService } from '../../cart-item/services/cart-item.service';
import { GameService } from '../../../game-service/game/services/game.service';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly paginationService: PaginationService,
    private readonly gameService: GameService,
    private readonly cartItemService: CartItemService,
  ) {}

  async createCart(
    userId: string,
    createCartDto: CreateCartDto,
  ): Promise<CartDocument> {
    return await this.cartRepository.create({ ...createCartDto, userId });
  }

  async findCartById(id: string): Promise<CartDocument> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async findCartByUserId(userId: string): Promise<CartDocument> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    return cart;
  }

  async findAll(): Promise<CartDocument[]> {
    return await this.cartRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<CartDocument>> {
    return this.paginationService.paginate(this.cartRepository, options);
  }

  async updateCart(
    id: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDocument | null> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return await this.cartRepository.updateById(id, updateCartDto);
  }

  async addItemToCart(
    userId: string,
    gameId: string,
  ): Promise<CartDocument | null> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId, {});
    }

    const game = await this.gameService.findGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const priceAtPurchase =
      game.price - (game.price * (game.discount || 0)) / 100;

    const cartItem = await this.cartItemService.createCartItem({
      cartId: cart._id.toString(),
      gameId,
      priceAtPurchase,
    });
    return await this.updateCart(cart._id.toString(), {
      itemId: [cartItem._id.toString()],
    });
  }

  async removeItemFromCart(
    userId: string,
    gameId: string,
  ): Promise<CartDocument | null> {
    const cart = await this.findCartByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItems = await this.cartItemService.findCartItemsByCartId(
      cart._id.toString(),
    );
    const itemToRemove = cartItems.find((item) => item.gameId === gameId);

    if (itemToRemove) {
      await this.cartItemService.deleteCartItem(itemToRemove._id.toString());
      cart.itemId = cart.itemId.filter(
        (id) => id !== itemToRemove._id.toString(),
      );
    }

    return await this.cartRepository.updateById(cart._id.toString(), {
      itemId: cart.itemId,
    });
  }

  async clearAll(userId: string): Promise<CartDocument | null> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemService.deleteCartItemsByCartId(cart._id.toString());

    return await this.updateCart(cart._id.toString(), {
      itemId: [],
    });
  }

  async deleteCart(id: string): Promise<CartDocument | null> {
    const cart = await this.cartRepository.findById(id);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return await this.cartRepository.deleteById(id);
  }
}
