import { Injectable } from '@nestjs/common';
import { GameService } from '../../game-service/game/services/game.service';
import { GameItemService } from '../../game-service/game-item/services/game-item.service';
import { NotFoundException } from '@nestjs/common';
import { Product } from '../types/product.type';

@Injectable()
export class ProductValidationService {
  constructor(
    private gameService: GameService,
    private gameItemService: GameItemService,
  ) {}

  async validateProductExists(
    productId: string,
  ): Promise<{ product: Product; type: 'game' | 'gameItem' }> {
    const product = await this.gameService.findGameById(productId);
    if (product) {
      return { product, type: 'game' };
    }
    const gameItem = await this.gameItemService.findGameItemById(productId);
    if (gameItem) {
      return { product: gameItem, type: 'gameItem' };
    }
    throw new NotFoundException('Product not found');
  }

  async calculateTotalPrice(productIds: string[]) {
    const products: Product[] = [];
    for (const productId of productIds) {
      const { product } = await this.validateProductExists(productId);
      products.push(product);
    }
    if (!products || !products.length)
      throw new NotFoundException('Products not found');
    return products.reduce((total, product) => {
      const priceAfterDiscount =
        product.price * (1 - (product.discount || 0) / 100);
      return total + priceAfterDiscount;
    }, 0);
  }
}
