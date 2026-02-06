import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { Comment, CommentSchema } from './entities/comment.entity';
import { CommentRepository } from './repositories/comment.repository';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Comment.name, schema: CommentSchema }],
      'BLOG_DB',
    ),
    BlogModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}
