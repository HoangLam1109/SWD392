import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from '../../../common/services/pagination.service';
import { UserService } from '../../../user-service/user/services/user.service';
import { GameService } from '../../game/services/game.service';
import { GameKeyService } from '../../game-key/services/game-key.service';
import { LibraryGameRepository } from '../repositories/library-game.repository';
import { LibraryGameService } from './library-game.service';

describe('LibraryGameService', () => {
  let service: LibraryGameService;

  const repositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    findHighestScoreLeaderboardByUser: jest.fn(),
  };

  const paginationServiceMock = {
    paginate: jest.fn(),
  };

  const userServiceMock = {
    findUserById: jest.fn(),
  };

  const gameServiceMock = {
    findGameById: jest.fn(),
  };

  const gameKeyServiceMock = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryGameService,
        {
          provide: LibraryGameRepository,
          useValue: repositoryMock,
        },
        {
          provide: PaginationService,
          useValue: paginationServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: GameService,
          useValue: gameServiceMock,
        },
        {
          provide: GameKeyService,
          useValue: gameKeyServiceMock,
        },
      ],
    }).compile();

    service = module.get<LibraryGameService>(LibraryGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw not found when record does not exist', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(NotFoundException);
  });

  it('should map rank in leaderboard response', async () => {
    repositoryMock.findHighestScoreLeaderboardByUser.mockResolvedValue([
      {
        user_id: '67d0f5ca8fa4f25a819f2a95',
        game_id: '67d0f5ca8fa4f25a819f2a96',
        highest_score: 200,
        total_playtime: 30,
        last_played_at: undefined,
        status: 'PLAYING',
      },
      {
        user_id: '67d0f5ca8fa4f25a819f2b05',
        game_id: '67d0f5ca8fa4f25a819f2a96',
        highest_score: 150,
        total_playtime: 25,
        last_played_at: undefined,
        status: 'OWNED',
      },
    ]);

    const result = await service.getHighestScoreLeaderboard(
      10,
      '67d0f5ca8fa4f25a819f2a96',
    );

    expect(repositoryMock.findHighestScoreLeaderboardByUser).toHaveBeenCalledWith(
      10,
      '67d0f5ca8fa4f25a819f2a96',
    );
    expect(result[0]).toMatchObject({
      rank: 1,
      user_id: '67d0f5ca8fa4f25a819f2a95',
      highest_score: 200,
    });
    expect(result[1]).toMatchObject({
      rank: 2,
      user_id: '67d0f5ca8fa4f25a819f2b05',
      highest_score: 150,
    });
  });
});
