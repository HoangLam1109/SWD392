import { Test, TestingModule } from '@nestjs/testing';
import { SystemRequirementController } from './system_requirement.controller';
import { SystemRequirementService } from './system_requirement.service';

describe('SystemRequirementController', () => {
  let controller: SystemRequirementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemRequirementController],
      providers: [SystemRequirementService],
    }).compile();

    controller = module.get<SystemRequirementController>(SystemRequirementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
