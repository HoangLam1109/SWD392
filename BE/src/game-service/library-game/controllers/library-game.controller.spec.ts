import { Test, TestingModule } from '@nestjs/testing';
import { LibraryGameController } from './library-game.controller';
import { LibraryGameService } from '../services/library-game.service';

describe('LibraryGameController', () => {
  let controller: LibraryGameController;

  const libraryGameServiceMock = {
    create: jest.fn(),
    findAllWithPagination: jest.fn(),
    getHighestScoreLeaderboard: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryGameController],
      providers: [
        {
          provide: LibraryGameService,
          useValue: libraryGameServiceMock,
        },
      ],
    }).compile();

    controller = module.get<LibraryGameController>(LibraryGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service leaderboard with parsed params', async () => {
    libraryGameServiceMock.getHighestScoreLeaderboard.mockResolvedValue([]);

    await controller.getHighestScoreLeaderboard(10, 5);

    expect(libraryGameServiceMock.getHighestScoreLeaderboard).toHaveBeenCalledWith(
      10,
      5,
    );
  });
});
