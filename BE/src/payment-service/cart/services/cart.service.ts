import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CartRepository } from '../repositories/cart.repository';
import { CartDocument } from '../entities/cart.entity';
import { CartItemService } from '../../cart-item/services/cart-item.service';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly paginationService: PaginationService,
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
    return (await this._UpdateCheck(id)).cart;
  }

  async findCartByUserId(userId: string): Promise<CartDocument> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    return (await this._UpdateCheck(cart._id.toString())).cart;
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
    productId: string,
  ): Promise<CartDocument | null> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId, {});
    }

    const cartItems = await this.cartItemService.findCartItemsByCartId(
      cart._id.toString(),
    );

    if (cartItems.some((item) => item.productId.toString() === productId)) {
      throw new BadRequestException('Product already in cart');
    }

    const cartItem = await this.cartItemService.createCartItemFromId(
      cart._id.toString(),
      productId,
    );
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return await this.updateCart(cart._id.toString(), {
      itemId: [...cart.itemId, cartItem._id.toString()],
    });
  }

  async removeItemFromCart(
    userId: string,
    productId: string,
  ): Promise<CartDocument | null> {
    const cart = await this.findCartByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItems = await this.cartItemService.findCartItemsByCartId(
      cart._id.toString(),
    );
    for (const cartItem of cartItems) {
      if (cartItem.productId === productId) {
        await this.cartItemService.deleteCartItem(cartItem._id.toString());
        cart.itemId = cart.itemId.filter(
          (id) => id !== cartItem._id.toString(),
        );
      }
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

  async getAllCartItemsFromUserId(
    userId: string,
  ): Promise<{ itemId: string[] }> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }
    return { itemId: cart.itemId };
  }

  private async _UpdateCheck(cartId: string): Promise<{
    cart: CartDocument;
    priceChanged: boolean;
  }> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (!cart.itemId || cart.itemId.length === 0) {
      return { cart: cart, priceChanged: false };
    }

    const existingItems = await this.cartItemService.findCartItemsByIds(
      cart.itemId,
    );
    const validIds = existingItems.map((item) => item._id.toString());
    const invalidIds = cart.itemId.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      await this.cartRepository.updateById(cartId, {
        itemId: validIds,
      });
      cart.itemId = validIds;
    }

    const results = await Promise.allSettled(
      validIds.map((id) =>
        this.cartItemService.updateProductPriceById(id.toString()),
      ),
    );

    const priceChanged = results.length > 0;

    return {
      cart: cart,
      priceChanged,
    };
  }
}
