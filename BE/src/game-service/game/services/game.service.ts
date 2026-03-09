import { Injectable } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { GameRepository } from '../repositories/game.repository';
import { GameDocument } from '../entities/game.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async createGame(createGameDto: CreateGameDto) {
    return await this.gameRepository.create(createGameDto);
  }

  async findGameByReleaseDate(releaseDate: Date) {
    return await this.gameRepository.findByReleaseDate(releaseDate);
  }

  async findGameById(id: string) {
    return await this.gameRepository.findById(id);
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
