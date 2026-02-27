import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { Blog, BlogSchema } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';
import { Comment, CommentSchema } from '../comment/entities/comment.entity';
import { CommentRepository } from '../comment/repositories/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Blog.name, schema: BlogSchema },
        { name: Comment.name, schema: CommentSchema },
      ],
      'BLOG_DB',
    ),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository, CommentRepository],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
