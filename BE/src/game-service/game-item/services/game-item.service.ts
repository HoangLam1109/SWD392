import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameItemDto } from '../dto/create-game-item.dto';
import { UpdateGameItemDto } from '../dto/update-game-item.dto';
import { GameItemRepository } from '../repositories/game-item.repository';
import { GameItemDocument } from '../entities/game-item.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class GameItemService {
  constructor(
    private readonly gameItemRepository: GameItemRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createGameItemDto: CreateGameItemDto,
  ): Promise<GameItemDocument> {
    return await this.gameItemRepository.create(createGameItemDto);
  }

  async findAll(): Promise<GameItemDocument[]> {
    return await this.gameItemRepository.findAll();
  }

  async findGameItemById(id: string): Promise<GameItemDocument | null> {
    return await this.gameItemRepository.findById(id);
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<GameItemDocument>> {
    return this.paginationService.paginate(this.gameItemRepository, options);
  }

  async findOne(id: string): Promise<GameItemDocument | null> {
    const gameItem = await this.gameItemRepository.findById(id);
    if (!gameItem) {
      throw new NotFoundException('Game item not found');
    }
    return gameItem;
  }

  async update(
    id: string,
    updateGameItemDto: UpdateGameItemDto,
  ): Promise<GameItemDocument | null> {
    return await this.gameItemRepository.updateById(id, updateGameItemDto);
  }

  async remove(id: string): Promise<GameItemDocument | null> {
    return await this.gameItemRepository.deleteById(id);
  }
}
