import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { UserService } from '../../../user-service/user/services/user.service';
import { GameService } from '../../game/services/game.service';
import { GameKeyService } from '../../game-key/services/game-key.service';
import { CreateLibraryGameDto } from '../dto/create-library-game.dto';
import { LibraryGameLeaderboardResponseDto } from '../dto/library-game-leaderboard.response';
import { UpdateLibraryGameDto } from '../dto/update-library-game.dto';
import { LibraryGameDocument } from '../entites/library-game.entity';
import { LibraryGameRepository } from '../repositories/library-game.repository';

@Injectable()
export class LibraryGameService {
  constructor(
    private readonly libraryGameRepository: LibraryGameRepository,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly gameKeyService: GameKeyService,
  ) {}

  async create(
    createLibraryGameDto: CreateLibraryGameDto,
  ): Promise<LibraryGameDocument> {
    await this.validateReferencedIds(createLibraryGameDto);
    return await this.libraryGameRepository.create(createLibraryGameDto);
  }

  async findAll(): Promise<LibraryGameDocument[]> {
    return await this.libraryGameRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<LibraryGameDocument>> {
    return this.paginationService.paginate(this.libraryGameRepository, options);
  }

  async findOne(id: string): Promise<LibraryGameDocument> {
    const libraryGame = await this.libraryGameRepository.findById(id);
    if (!libraryGame) {
      throw new NotFoundException('Library game not found');
    }

    return libraryGame;
  }

  async update(
    id: string,
    updateLibraryGameDto: UpdateLibraryGameDto,
  ): Promise<LibraryGameDocument | null> {
    const existingLibraryGame = await this.findOne(id);
    await this.validateReferencedIds({
      user_id: updateLibraryGameDto.user_id ?? existingLibraryGame.user_id,
      game_id: updateLibraryGameDto.game_id ?? existingLibraryGame.game_id,
      key_id: updateLibraryGameDto.key_id ?? existingLibraryGame.key_id,
    });
    return await this.libraryGameRepository.updateById(
      id,
      updateLibraryGameDto,
    );
  }

  async remove(id: string): Promise<LibraryGameDocument | null> {
    return await this.libraryGameRepository.deleteById(id);
  }

  async getHighestScoreLeaderboard(
    limit = 10,
    gameId?: string,
  ): Promise<LibraryGameLeaderboardResponseDto[]> {
    const normalizedLimit = Number.isNaN(limit)
      ? 10
      : Math.min(Math.max(limit, 1), 100);
    const normalizedGameId = gameId?.trim() ? gameId.trim() : undefined;

    const leaderboard =
      await this.libraryGameRepository.findHighestScoreLeaderboardByUser(
        normalizedLimit,
        normalizedGameId,
      );

    return leaderboard.map((entry, index) => ({
      rank: index + 1,
      user_id: entry.user_id,
      game_id: entry.game_id,
      highest_score: entry.highest_score,
      total_playtime: entry.total_playtime,
      last_played_at: entry.last_played_at,
      status: entry.status,
    }));
  }

  async createWithKey(
    userId: string,
    gameId: string,
  ): Promise<LibraryGameDocument> {
    const libraryGame = await this.create({
      user_id: userId,
      game_id: gameId,
      key_id: 'TEMP_KEY_ID',
    });
    await this.assignKeyToLibraryGame(libraryGame._id.toString());
    return libraryGame;
  }

  private async assignKeyToLibraryGame(
    libraryGameId: string,
  ): Promise<LibraryGameDocument | null> {
    const libraryGame = await this.findOne(libraryGameId);

    const key = await this.gameKeyService.assignKey(
      libraryGame.game_id,
      libraryGameId,
    );

    await this.validateReferencedIds({
      user_id: libraryGame.user_id,
      game_id: libraryGame.game_id,
      key_id: key._id.toString(),
    });
    const result = await this.libraryGameRepository.updateById(libraryGameId, {
      key_id: key._id.toString(),
    });
    return result;
  }

  private async validateReferencedIds(input: {
    user_id: string;
    game_id: string;
    key_id: string;
  }): Promise<void> {
    const [user, game, gameKey] = await Promise.all([
      this.userService.findUserById(input.user_id),
      this.gameService.findGameById(input.game_id),
      this.gameKeyService.findById(input.key_id),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (gameKey.gameId !== input.game_id) {
      throw new BadRequestException(
        'Game key does not belong to the provided game',
      );
    }
  }
}
