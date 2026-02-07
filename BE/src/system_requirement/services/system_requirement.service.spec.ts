import { Test, TestingModule } from '@nestjs/testing';
import { SystemRequirementService } from './system_requirement.service';
import { SystemRequirementRepository } from '../repositories/system_requirement.repository';
import { GameRepository } from '../../game/repositories/game.repository';

describe('SystemRequirementService', () => {
  let service: SystemRequirementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SystemRequirementService,
        {
          provide: SystemRequirementRepository,
          useValue: {},
        },
        {
          provide: GameRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SystemRequirementService>(SystemRequirementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
