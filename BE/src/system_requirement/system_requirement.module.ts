import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemRequirementService } from './services/system_requirement.service';
import { SystemRequirementController } from './controllers/system_requirement.controller';
import {
  SystemRequirement,
  SystemRequirementSchema,
} from './entities/system_requirement.entity';
import { SystemRequirementRepository } from './repositories/system_requirement.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SystemRequirement.name, schema: SystemRequirementSchema }],
      'GAME_DB',
    ),
  ],
  controllers: [SystemRequirementController],
  providers: [SystemRequirementService, SystemRequirementRepository],
  exports: [SystemRequirementService],
})
export class SystemRequirementModule {}
