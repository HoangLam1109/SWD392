import { Injectable } from '@nestjs/common';
import { GameService } from 'src/game-service/game/services/game.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductValidationService {
  constructor(private gameService: GameService) {}

  async validateProductExists(productId: string) {
    const product = await this.gameService.findGameById(productId);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async calculateTotalPrice(productIds: string[]) {
    const products = await this.gameService.findGamesByIds(productIds);
    if (!products || !products.length)
      throw new NotFoundException('Products not found');
    return products.reduce((total, product) => {
      const priceAfterDiscount =
        product.price * (1 - (product.discount || 0) / 100);
      return total + priceAfterDiscount;
    }, 0);
  }
}
