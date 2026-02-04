import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, IBlog } from '../entities/blog.entity';

export interface IBlogRepository {
  findById(id: string, fields?: string): Promise<BlogDocument | null>;
  findByUserId(userId: string): Promise<BlogDocument[]>;
  create(blogData: any): Promise<BlogDocument>;
  updateById(id: string, blogData: any): Promise<BlogDocument | null>;
  softDeleteById(id: string): Promise<BlogDocument | null>;
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
    @InjectModel(Blog.name, 'GAME_DB') private blogModel: Model<BlogDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<BlogDocument | null> {
    return await this.blogModel.findOne(
      { _id: id, deletedAt: null },
      fields || '_id title content thumbnailUrl status viewCount publishedAt userId created_at updated_at',
    );
  }

  async findByUserId(userId: string): Promise<BlogDocument[]> {
    return await this.blogModel.find({ userId, deletedAt: null }).lean();
  }

  async create(blogData: any): Promise<BlogDocument> {
    const blog = new this.blogModel(blogData);
    return await blog.save();
  }

  async updateById(
    id: string,
    blogData: Partial<IBlog>,
  ): Promise<BlogDocument | null> {
    return await this.blogModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        blogData,
        { new: true },
      )
      .orFail(new NotFoundException('Blog not found'))
      .exec();
  }

  async softDeleteById(id: string): Promise<BlogDocument | null> {
    return await this.blogModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true },
      )
      .orFail(new NotFoundException('Blog not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<BlogDocument[]> {
    return await this.blogModel.find({ deletedAt: null }, fields);
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
    
    // Always filter out soft-deleted blogs
    query.deletedAt = null;
    
    return await this.blogModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    // Always filter out soft-deleted blogs
    query.deletedAt = null;
    return await this.blogModel.countDocuments(query);
  }

  async incrementViewCount(id: string): Promise<BlogDocument | null> {
    return await this.blogModel
      .findOneAndUpdate(
        { _id: id, deletedAt: null },
        { $inc: { viewCount: 1 } },
        { new: true },
      )
      .exec();
  }
}
