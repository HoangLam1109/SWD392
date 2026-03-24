import { Injectable } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { GameRepository } from '../repositories/game.repository';
import { GameDocument } from '../entities/game.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { GameKeyService } from '../../game-key/services/game-key.service';
import { IndexingService } from '../../../ai/services/indexing.service';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly paginationService: PaginationService,
    private readonly gameKeyService: GameKeyService,
    private readonly indexingService: IndexingService,
  ) {}

  async createGame(createGameDto: CreateGameDto) {
    const game = await this.gameRepository.create(createGameDto);
    await this.gameKeyService.generateKeys(game._id.toString(), 10);

    try {
      await this.indexingService.indexGame(game);
    } catch (error) {
      console.error('Failed to index game for AI search:', error);
    }

    return game;
  }

  async findGameByReleaseDate(releaseDate: Date) {
    return await this.gameRepository.findByReleaseDate(releaseDate);
  }

  async findGameById(id: string) {
    return await this.gameRepository.findById(id);
  }

  async findGameByCategoryId(categoryId: string) {
    return await this.gameRepository.findByCategoryId(categoryId);
  }

  async findGamesByIds(ids: string[]) {
    return await this.gameRepository.findByIds(ids);
  }

  async findByPrice(price: number) {
    return await this.gameRepository.findByPrice(price);
  }

  async findAll() {
    return await this.gameRepository.findAll();
  }

  async findAllForIndexing() {
    const games = await this.gameRepository.findAll();
    return await this.indexingService.indexAllGames(
      games.map((game) => ({
        id: game._id.toString(),
        title: game.title,
        description: game.description,
        price: game.price,
        releaseDate: game.releaseDate,
        categoryId: game.categoryId.toString(),
        developer: game.developer,
        publisher: game.publisher,
        isActive: game.isActive,
      })),
    );
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<GameDocument>> {
    return this.paginationService.paginate(this.gameRepository, options);
  }

  async updateGame(
    id: string,
    updateGameDto: UpdateGameDto,
  ): Promise<GameDocument | null> {
    return await this.gameRepository.updateById(id, updateGameDto);
  }

  async deleteGame(id: string) {
    return await this.gameRepository.deleteById(id);
  }
}
