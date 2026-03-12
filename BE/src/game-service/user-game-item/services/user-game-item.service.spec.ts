import { Test, TestingModule } from '@nestjs/testing';
import { UserGameItemService } from './user-game-item.service';

describe('UserGameItemService', () => {
  let service: UserGameItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGameItemService],
    }).compile();

    service = module.get<UserGameItemService>(UserGameItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
