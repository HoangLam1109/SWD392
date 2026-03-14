import { Injectable } from '@nestjs/common';
import { AIService } from './ai.service';
import { VectorRepository } from '../repositories/vector.repository';
import {
  GameIndexData,
  CategoryIndexData,
} from '../../common/types/index.type';

@Injectable()
export class IndexingService {
  constructor(
    private readonly aiService: AIService,
    private readonly vectorRepository: VectorRepository,
  ) {}

  async indexGame(game: GameIndexData) {
    try {
      const gameContent = this.createGameSearchContent(game);

      await this.aiService.addText(gameContent, game.id);

      return {
        success: true,
        gameId: game.id,
        message: 'Game indexed successfully',
      };
    } catch (error) {
      console.error(`Error indexing game ${game.id}:`, error);
      throw error;
    }
  }

  async indexCategory(category: CategoryIndexData) {
    try {
      const categoryContent = this.createCategorySearchContent(category);

      await this.aiService.addText(categoryContent, category.id);

      return {
        success: true,
        categoryId: category.id,
        message: 'Category indexed successfully',
      };
    } catch (error) {
      console.error(`Error indexing category ${category.id}:`, error);
      throw error;
    }
  }

  async indexAllGames(games: GameIndexData[]) {
    try {
      const results: Record<string, any>[] = [];

      for (const game of games) {
        try {
          const vector = await this.vectorRepository.findByFileId(game.id);
          if (vector) {
            await this.reindexGame(game);
          } else {
            await this.indexGame(game);
          }
          results.push({ gameId: game.id, status: 'success' });
        } catch (error) {
          results.push({
            gameId: game.id,
            status: 'error',
            error: error.message,
          });
        }
      }

      return {
        total: games.length,
        successful: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'error').length,
        results,
      };
    } catch (error) {
      console.error('Error indexing all games:', error);
      throw error;
    }
  }

  async indexAllCategories(categories: CategoryIndexData[]) {
    try {
      const results: Record<string, any>[] = [];

      for (const category of categories) {
        try {
          await this.indexCategory(category);
          results.push({ categoryId: category.id, status: 'success' });
        } catch (error) {
          results.push({
            categoryId: category.id,
            status: 'error',
            error: error.message,
          });
        }
      }

      return {
        total: categories.length,
        successful: results.filter((r) => r.status === 'success').length,
        failed: results.filter((r) => r.status === 'error').length,
        results,
      };
    } catch (error) {
      console.error('Error indexing all categories:', error);
      throw error;
    }
  }

  async reindexGame(game: GameIndexData) {
    try {
      await this.vectorRepository.deleteManyByFileId(game.id);
      return await this.indexGame(game);
    } catch (error) {
      console.error(`Error reindexing game ${game.id}:`, error);
      throw error;
    }
  }

  private createGameSearchContent(game: GameIndexData): string {
    const content = [
      `Game: ${game.title}`,
      `Description: ${game.description ?? ''}`,
      `Developer: ${game.developer ?? 'Unknown'}`,
      `Publisher: ${game.publisher ?? 'Unknown'}`,
      `Category: ${game.categoryId ?? 'Unknown'}`,
      `Release Date: ${game.releaseDate?.toISOString() ?? 'Unknown'}`,
      `Price: $${game.price ?? '0'}`,
      `Discount: ${game.discount ?? 0}%`,
      `Active: ${game.isActive ? 'Yes' : 'No'}`,
    ];

    if (game.url) {
      content.push(`URL: ${game.url}`);
    }

    if (game.thumbnail) {
      content.push(`Thumbnail: ${game.thumbnail}`);
    }

    if (game.coverImage) {
      content.push(`Cover Image: ${game.coverImage}`);
    }

    return content.join('\n');
  }

  private createCategorySearchContent(category: CategoryIndexData): string {
    const content = [
      `Category: ${category.categoryName}`,
      `Description: ${category.description ?? ''}`,
    ];

    if (category.parentCategoryId) {
      content.push(`Parent Category ID: ${category.parentCategoryId}`);
    }

    return content.join('\n');
  }

  async searchGames(query: string, sessionId?: string) {
    try {
      const response = await this.aiService.getText(query, sessionId || '');
      return response;
    } catch (error) {
      console.error('Error searching games:', error);
      throw error;
    }
  }
}
