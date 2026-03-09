import { Test, TestingModule } from '@nestjs/testing';
import { GameItemController } from './game-item.controller';
import { GameItemService } from '../services/game-item.service';

describe('GameItemController', () => {
  let controller: GameItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameItemController],
      providers: [GameItemService],
    }).compile();

    controller = module.get<GameItemController>(GameItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
