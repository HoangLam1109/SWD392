import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItemRepository } from '../repositories/cart-item.repository';
import { CartItemDocument } from '../entities/cart-item.entity';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { ProductValidationService } from '../../../common/services/productValidation.service';
import { GameService } from '../../../game-service/game/services/game.service';

@Injectable()
export class CartItemService {
  constructor(
    private readonly cartItemRepository: CartItemRepository,
    private readonly paginationService: PaginationService,
    private readonly productValidationService: ProductValidationService,
    private readonly gameService: GameService,
  ) {}

  async createCartItem(
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItemDocument> {
    return await this.cartItemRepository.create(createCartItemDto);
  }

  async findCartItemById(id: string): Promise<CartItemDocument> {
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return cartItem;
  }

  async findCartItemsByCartId(cartId: string): Promise<CartItemDocument[]> {
    return await this.cartItemRepository.findByCartId(cartId);
  }

  async findCartItemsByIds(ids: string[]): Promise<CartItemDocument[]> {
    return await this.cartItemRepository.findByIds(ids);
  }

  async createCartItemFromId(
    cartId: string,
    productId: string,
  ): Promise<CartItemDocument | null> {
    const product =
      await this.productValidationService.validateProductExists(productId);

    return await this.cartItemRepository.create({
      cartId,
      productId,
      priceAtPurchase: product.price,
      discount: product.discount!,
    });
  }

  async updateGamePriceById(id: string): Promise<CartItemDocument | null> {
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    const game = await this.gameService.findGameById(cartItem.productId);

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (
      game.price !== cartItem.priceAtPurchase ||
      game.discount !== cartItem.discount
    ) {
      return await this.cartItemRepository.updateById(id, {
        priceAtPurchase: game.price,
        discount: game.discount,
      });
    }
    return cartItem;
  }

  async findAll(): Promise<CartItemDocument[]> {
    return await this.cartItemRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<CartItemDocument>> {
    return this.paginationService.paginate(this.cartItemRepository, options);
  }

  async updateCartItem(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItemDocument | null> {
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return await this.cartItemRepository.updateById(id, updateCartItemDto);
  }

  async deleteCartItem(id: string): Promise<CartItemDocument | null> {
    const cartItem = await this.cartItemRepository.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return await this.cartItemRepository.deleteById(id);
  }

  async deleteCartItemsByCartId(cartId: string): Promise<void> {
    await this.cartItemRepository.deleteManyByCartId(cartId);
  }
}
