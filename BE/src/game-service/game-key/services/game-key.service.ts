import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { CreateGameKeyDto } from '../dto/create-game-key.dto';
import { UpdateGameKeyDto } from '../dto/update-game-key.dto';
import { GameKeyRepository } from '../repositories/game-key.repository';
import { GameKeyDocument } from '../entities/game-key.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { KeyStatus } from '../enum/key-status.enum';

@Injectable()
export class GameKeyService {
  constructor(
    private readonly gameKeyRepository: GameKeyRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createGameKeyDto: CreateGameKeyDto): Promise<GameKeyDocument> {
    const existingKey = await this.gameKeyRepository.findByKeyCode(
      createGameKeyDto.keyCode,
    );
    if (existingKey) {
      throw new NotFoundException('Game key with this code already exists');
    }

    return await this.gameKeyRepository.create(createGameKeyDto);
  }

  async findAll(): Promise<GameKeyDocument[]> {
    return await this.gameKeyRepository.findAll();
  }

  async findById(id: string): Promise<GameKeyDocument> {
    const gameKey = await this.gameKeyRepository.findById(id);
    if (!gameKey || gameKey.status !== 'EXPIRED') {
      throw new NotFoundException('Game key not found or has been expired');
    }
    return gameKey;
  }

  async findAndValidateKey(
    id: string,
    gameId: string,
  ): Promise<GameKeyDocument> {
    const gameKey = await this.gameKeyRepository.findById(id);
    if (!gameKey || gameKey.status !== 'EXPIRED') {
      throw new NotFoundException('Game key not found or has been expired');
    }
    if (gameKey.gameId !== gameId) {
      throw new NotFoundException('Game key does not belong to this game');
    }

    return gameKey;
  }

  async findByGameId(gameId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyRepository.findByGameId(gameId);
  }

  async findAvailableKeys(gameId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyRepository.findAvailableKeys(gameId);
  }

  async findByLibraryGameId(libraryGameId: string): Promise<GameKeyDocument[]> {
    return await this.gameKeyRepository.findByLibraryGameId(libraryGameId);
  }

  async findByStatus(status: KeyStatus): Promise<GameKeyDocument[]> {
    return await this.gameKeyRepository.findByStatus(status);
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<GameKeyDocument>> {
    return this.paginationService.paginate(this.gameKeyRepository, options);
  }

  async update(
    id: string,
    updateGameKeyDto: UpdateGameKeyDto,
  ): Promise<GameKeyDocument> {
    const gameKey = await this.gameKeyRepository.findById(id);
    if (!gameKey || gameKey.status !== 'EXPIRED') {
      throw new NotFoundException('Game key not found or has been expired');
    }

    if (
      updateGameKeyDto.keyCode &&
      updateGameKeyDto.keyCode !== gameKey.keyCode
    ) {
      const existingKey = await this.gameKeyRepository.findByKeyCode(
        updateGameKeyDto.keyCode,
      );
      if (existingKey) {
        throw new NotFoundException('Game key with this code already exists');
      }
    }

    const result = await this.gameKeyRepository.updateById(
      id,
      updateGameKeyDto,
    );
    if (!result) {
      throw new NotFoundException('Failed to update game key');
    }
    return result;
  }

  async remove(id: string): Promise<GameKeyDocument> {
    const gameKey = await this.gameKeyRepository.findById(id);
    if (!gameKey || gameKey.status !== 'EXPIRED') {
      throw new NotFoundException('Game key not found or has been expired');
    }
    const result = await this.gameKeyRepository.deleteById(id);
    if (!result) {
      throw new NotFoundException('Failed to delete game key');
    }
    return result;
  }

  private _formatKeys(key: string) {
    return (
      key
        .toUpperCase()
        .match(/.{1,4}/g)
        ?.join('-') ?? key
    );
  }

  async generateKeys(
    gameId: string,
    quantity: number,
  ): Promise<GameKeyDocument[]> {
    const keys = Array.from({ length: quantity }, () => ({
      gameId,
      keyCode: this._formatKeys(nanoid(16)),
      status: KeyStatus.AVAILABLE,
    }));
    return this.gameKeyRepository.createMany(keys);
  }

  async assignKey(
    gameId: string,
    libraryGameId: string,
  ): Promise<GameKeyDocument> {
    await this.generateKeys(gameId, 5);
    const gameKeys = await this.gameKeyRepository.findByGameId(gameId);
    if (!gameKeys || gameKeys.length === 0) {
      throw new NotFoundException('Game keys not found for this game');
    }

    const availableKey = gameKeys.find((key) => key.status === 'AVAILABLE');
    if (!availableKey) {
      throw new BadRequestException('No available game keys for this game');
    }

    const updatedGameKey = await this.gameKeyRepository.updateById(
      availableKey._id.toString(),
      {
        status: KeyStatus.ASSIGNED,
        libraryGameId,
        assignedAt: new Date(),
      },
    );

    if (!updatedGameKey) {
      throw new NotFoundException('Failed to assign game key');
    }

    return updatedGameKey;
  }

  async deleteManyByGameId(gameId: string): Promise<void> {
    const keys = await this.gameKeyRepository.findByGameId(gameId);
    for (const key of keys) {
      await this.gameKeyRepository.deleteById(key.id);
    }
  }
}
