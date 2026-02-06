import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { Blog, BlogSchema } from './entities/blog.entity';
import { BlogRepository } from './repositories/blog.repository';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Blog.name, schema: BlogSchema }],
      'BLOG_DB',
    ),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService, BlogRepository],
})
export class BlogModule {}
