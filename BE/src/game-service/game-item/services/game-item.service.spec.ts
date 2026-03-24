import { Test, TestingModule } from '@nestjs/testing';
import { GameItemService } from './game-item.service';

describe('GameItemService', () => {
  let service: GameItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameItemService],
    }).compile();

    service = module.get<GameItemService>(GameItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
