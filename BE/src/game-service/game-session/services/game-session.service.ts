import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';
import { LibraryGameService } from '../../library-game/services/library-game.service';
import { CreateGameSessionDto } from '../dto/create-game-session.dto';
import { EndGameSessionDto } from '../dto/end-game-session.dto';
import { UpdateGameSessionDto } from '../dto/update-game-session.dto';
import { GameSessionDocument } from '../entities/game-session.entity';
import { GameSessionRepository } from '../repositories/game-session.repository';

@Injectable()
export class GameSessionService {
  constructor(
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly paginationService: PaginationService,
    private readonly libraryGameService: LibraryGameService,
  ) {}

  async create(
    userId: string,
    libraryGameId: string,
    createGameSessionDto: CreateGameSessionDto,
  ): Promise<GameSessionDocument> {
    await this.validateLibraryGameId(libraryGameId);

    const startedAt = createGameSessionDto.started_at
      ? new Date(createGameSessionDto.started_at)
      : new Date();
    const endedAt = createGameSessionDto.ended_at
      ? new Date(createGameSessionDto.ended_at)
      : undefined;
    const calculatedDuration = endedAt
      ? Math.max(
          0,
          Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
        )
      : 0;

    const createdSession = await this.gameSessionRepository.create({
      library_game_id: libraryGameId,
      session_score: createGameSessionDto.session_score ?? 0,
      session_duration:
        createGameSessionDto.session_duration ?? calculatedDuration,
      started_at: startedAt,
      ended_at: endedAt,
    });

    await this.syncLibraryGameHighestScore(
      userId,
      createdSession.library_game_id,
      createdSession.session_score,
      createdSession.ended_at,
    );

    await this.syncLibraryGameTotalPlaytime(createdSession.library_game_id);

    return createdSession;
  }

  async findAll(): Promise<GameSessionDocument[]> {
    return await this.gameSessionRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<GameSessionDocument>> {
    return this.paginationService.paginate(this.gameSessionRepository, options);
  }

  async findOne(id: string): Promise<GameSessionDocument> {
    const gameSession = await this.gameSessionRepository.findById(id);
    if (!gameSession) {
      throw new NotFoundException('Game session not found');
    }

    return gameSession;
  }

  async update(
    userId: string,
    id: string,
    updateGameSessionDto: UpdateGameSessionDto,
  ): Promise<GameSessionDocument | null> {
    const existingSession = await this.findOne(id);
    const previousLibraryGameId = existingSession.library_game_id;

    if (updateGameSessionDto.library_game_id) {
      await this.validateLibraryGameId(updateGameSessionDto.library_game_id);
    }

    const startedAt = updateGameSessionDto.started_at
      ? new Date(updateGameSessionDto.started_at)
      : existingSession.started_at
        ? new Date(existingSession.started_at)
        : undefined;
    const endedAt = updateGameSessionDto.ended_at
      ? new Date(updateGameSessionDto.ended_at)
      : existingSession.ended_at
        ? new Date(existingSession.ended_at)
        : undefined;

    const updatePayload: UpdateGameSessionDto & { session_duration?: number } =
      {
        ...updateGameSessionDto,
        started_at: startedAt,
        ended_at: endedAt,
      };

    if (startedAt && endedAt) {
      updatePayload.session_duration = Math.max(
        0,
        Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
      );
    }

    if (updateGameSessionDto.session_duration !== undefined) {
      updatePayload.session_duration = updateGameSessionDto.session_duration;
    }

    const updatedSession = await this.gameSessionRepository.updateById(
      id,
      updatePayload,
    );

    if (!updatedSession) {
      throw new NotFoundException('Game session not found');
    }

    await this.syncLibraryGameHighestScore(
      userId,
      updatedSession.library_game_id,
      updatedSession.session_score,
      updatedSession.ended_at,
    );

    await this.syncLibraryGameTotalPlaytime(updatedSession.library_game_id);
    if (updatedSession.library_game_id !== previousLibraryGameId) {
      await this.syncLibraryGameTotalPlaytime(previousLibraryGameId);
    }

    return updatedSession;
  }

  async remove(id: string): Promise<GameSessionDocument | null> {
    return await this.gameSessionRepository.deleteById(id);
  }

  async play(libraryGameId: string): Promise<GameSessionDocument> {
    await this.validateLibraryGameId(libraryGameId);

    const createdSession = await this.gameSessionRepository.create({
      library_game_id: libraryGameId,
      session_score: 0,
      session_duration: 0,
      started_at: new Date(),
      ended_at: undefined,
    });

    await this.syncLibraryGameTotalPlaytime(libraryGameId);

    return createdSession;
  }

  async end(
    id: string,
    endGameSessionDto: EndGameSessionDto,
  ): Promise<GameSessionDocument> {
    const existingSession = await this.findOne(id);
    await this.validateLibraryGameId(existingSession.library_game_id);

    const endedAt = new Date();
    const startedAt = existingSession.started_at
      ? new Date(existingSession.started_at)
      : endedAt;
    const calculatedDuration = Math.max(
      0,
      Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
    );

    const updatedSession = await this.gameSessionRepository.updateById(id, {
      session_score: endGameSessionDto.session_score,
      session_duration: calculatedDuration,
      ended_at: endedAt,
    });

    if (!updatedSession) {
      throw new NotFoundException('Game session not found');
    }

    const libraryGame = await this.libraryGameService.findOne(
      updatedSession.library_game_id,
    );

    if (updatedSession.session_score > libraryGame.highest_score) {
      await this.libraryGameService.update(updatedSession.library_game_id, {
        highest_score: updatedSession.session_score,
        last_played_at: endedAt,
      });
    }

    await this.syncLibraryGameTotalPlaytime(updatedSession.library_game_id);

    return updatedSession;
  }

  private async validateLibraryGameId(libraryGameId: string): Promise<void> {
    await this.libraryGameService.findOne(libraryGameId);
  }

  private async syncLibraryGameHighestScore(
    userId: string,
    libraryGameId: string,
    sessionScore: number,
    playedAt?: Date,
  ): Promise<void> {
    const libraryGame = await this.libraryGameService.findByUserId(
      userId,
      libraryGameId,
    );

    if (!libraryGame) {
      throw new NotFoundException('Library game not found');
    }

    if (sessionScore > libraryGame.highest_score) {
      await this.libraryGameService.update(libraryGameId, {
        highest_score: sessionScore,
        last_played_at: playedAt,
      });
    }
  }

  private async syncLibraryGameTotalPlaytime(
    libraryGameId: string,
  ): Promise<void> {
    const totalPlaytime =
      await this.gameSessionRepository.sumSessionDurationByLibraryGameId(
        libraryGameId,
      );

    await this.libraryGameService.update(libraryGameId, {
      total_playtime: Math.floor(totalPlaytime / 60),
    });
  }
}
