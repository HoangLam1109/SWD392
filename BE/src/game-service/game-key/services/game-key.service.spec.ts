import { Test, TestingModule } from '@nestjs/testing';
import { GameKeyService } from './game-key.service';

describe('GameKeyService', () => {
  let service: GameKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameKeyService],
    }).compile();

    service = module.get<GameKeyService>(GameKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
