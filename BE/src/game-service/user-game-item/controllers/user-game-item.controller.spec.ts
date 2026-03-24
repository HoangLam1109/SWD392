import { Test, TestingModule } from '@nestjs/testing';
import { UserGameItemController } from './user-game-item.controller';
import { UserGameItemService } from '../services/user-game-item.service';

describe('UserGameItemController', () => {
  let controller: UserGameItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGameItemController],
      providers: [UserGameItemService],
    }).compile();

    controller = module.get<UserGameItemController>(UserGameItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
