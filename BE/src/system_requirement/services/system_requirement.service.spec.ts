import { Test, TestingModule } from '@nestjs/testing';
import { SystemRequirementService } from './system_requirement.service';

describe('SystemRequirementService', () => {
  let service: SystemRequirementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemRequirementService],
    }).compile();

    service = module.get<SystemRequirementService>(SystemRequirementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
