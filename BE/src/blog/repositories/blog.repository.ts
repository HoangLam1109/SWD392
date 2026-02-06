import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, IBlog } from '../entities/blog.entity';

export interface IBlogRepository {
  findById(id: string, fields?: string): Promise<BlogDocument | null>;
  findByUserId(userId: string, status?: string): Promise<BlogDocument[]>;
  create(blogData: any): Promise<BlogDocument>;
  updateById(id: string, blogData: any): Promise<BlogDocument>;
  deleteById(id: string): Promise<void>;
  findAll(fields?: string): Promise<BlogDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<BlogDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
  incrementViewCount(id: string): Promise<BlogDocument | null>;
}

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(
    @InjectModel(Blog.name, 'BLOG_DB') private blogModel: Model<BlogDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<BlogDocument | null> {
    return await this.blogModel.findOne(
      { _id: id },
      fields || '_id title content thumbnailUrl status viewCount publishedAt userId created_at updated_at',
    );
  }

  async findByUserId(userId: string, status?: string): Promise<BlogDocument[]> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }
    return await this.blogModel.find(query).lean();
  }

  async create(blogData: any): Promise<BlogDocument> {
    const blog = new this.blogModel(blogData);
    return await blog.save();
  }

  async updateById(
    id: string,
    blogData: Partial<IBlog>,
  ): Promise<BlogDocument> {
    return await this.blogModel
      .findOneAndUpdate(
        { _id: id },
        blogData,
        { new: true },
      )
      .orFail(new NotFoundException('Blog not found'))
      .exec();
  }

  async deleteById(id: string): Promise<void> {
  await this.blogModel.findByIdAndDelete(id).exec();
}

  async findAll(fields?: string): Promise<BlogDocument[]> {
    return await this.blogModel.find({}, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<BlogDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };
    
    return await this.blogModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    return await this.blogModel.countDocuments(query);
  }

  async incrementViewCount(id: string): Promise<BlogDocument | null> {
    return await this.blogModel
      .findOneAndUpdate(
        { _id: id },
        { $inc: { viewCount: 1 } },
        { new: true },
      )
      .exec();
  }
}
