import { Injectable } from '@nestjs/common';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { GameRepository } from '../repositories/game.repository';
import { GameDocument } from '../entities/game.entity';

@Injectable()
export class GameService {
  constructor(private readonly gameRepository: GameRepository) {}

  async createGame(createGameDto: CreateGameDto) {
    return await this.gameRepository.create(createGameDto);
  }

  async findGameByReleaseDate(releaseDate: Date) {
    return await this.gameRepository.findByReleaseDate(releaseDate);
  }

  async findGameById(id: string) {
    return await this.gameRepository.findById(id);
  }

  async findByPrice(price: number) {
    return await this.gameRepository.findByPrice(price);
  }

  async findAll() {
    return await this.gameRepository.findAll();
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
