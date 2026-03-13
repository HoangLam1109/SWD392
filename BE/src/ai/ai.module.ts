import { Module } from '@nestjs/common';
import { AIService } from './services/ai.service';
import { LoaderService } from './services/loader.service';
import { EmbeddingService } from './services/embedding.service';
import { IndexingService } from './services/indexing.service';
import { AiController } from './controllers/ai.controller';
import { VectorRepository } from './repositories/vector.repository';
import { ChatRepository } from './repositories/chat.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Vector, VectorSchema } from './entities/vector.entity';
import { Chat, ChatSchema } from './entities/chat.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Vector.name, schema: VectorSchema }],
      'AI_DB',
    ),
    MongooseModule.forFeature(
      [{ name: Chat.name, schema: ChatSchema }],
      'AI_DB',
    ),
  ],
  controllers: [AiController],
  providers: [
    AIService,
    LoaderService,
    EmbeddingService,
    VectorRepository,
    ChatRepository,
    IndexingService,
  ],
  exports: [IndexingService],
})
export class AiModule {}
