import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { Category, CategorySchema } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Category.name, schema: CategorySchema }],
      'GAME_DB',
    ),
    AiModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
