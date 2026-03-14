import { Test, TestingModule } from '@nestjs/testing';
import { GameKeyController } from './game-key.controller';
import { GameKeyService } from '../services/game-key.service';

describe('GameKeyController', () => {
  let controller: GameKeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameKeyController],
      providers: [GameKeyService],
    }).compile();

    controller = module.get<GameKeyController>(GameKeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
