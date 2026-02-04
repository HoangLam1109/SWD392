import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, IComment } from '../entities/comment.entity';

export interface ICommentRepository {
  findById(id: string, fields?: string): Promise<CommentDocument | null>;
  findByBlogId(blogId: string): Promise<CommentDocument[]>;
  findByUserId(userId: string): Promise<CommentDocument[]>;
  findByParentCommentId(parentCommentId: string): Promise<CommentDocument[]>;
  create(commentData: any): Promise<CommentDocument>;
  updateById(id: string, commentData: any): Promise<CommentDocument | null>;
  softDeleteById(id: string): Promise<CommentDocument | null>;
  findAll(fields?: string): Promise<CommentDocument[]>;
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<CommentDocument[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(
    @InjectModel(Comment.name, 'GAME_DB')
    private commentModel: Model<CommentDocument>,
  ) {}

  async findById(id: string, fields?: string): Promise<CommentDocument | null> {
    return await this.commentModel.findOne(
      { _id: id, isDeleted: false },
      fields || '_id content blogId userId parentCommentId isDeleted created_at updated_at',
    );
  }

  async findByBlogId(blogId: string): Promise<CommentDocument[]> {
    return await this.commentModel
      .find({ blogId, isDeleted: false })
      .sort({ created_at: -1 })
      .lean();
  }

  async findByUserId(userId: string): Promise<CommentDocument[]> {
    return await this.commentModel
      .find({ userId, isDeleted: false })
      .sort({ created_at: -1 })
      .lean();
  }

  async findByParentCommentId(
    parentCommentId: string,
  ): Promise<CommentDocument[]> {
    return await this.commentModel
      .find({ parentCommentId, isDeleted: false })
      .sort({ created_at: -1 })
      .lean();
  }

  async create(commentData: any): Promise<CommentDocument> {
    const comment = new this.commentModel(commentData);
    return await comment.save();
  }

  async updateById(
    id: string,
    commentData: Partial<IComment>,
  ): Promise<CommentDocument | null> {
    return await this.commentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, commentData, {
        new: true,
      })
      .orFail(new NotFoundException('Comment not found'))
      .exec();
  }

  async softDeleteById(id: string): Promise<CommentDocument | null> {
    return await this.commentModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .orFail(new NotFoundException('Comment not found'))
      .exec();
  }

  async findAll(fields?: string): Promise<CommentDocument[]> {
    return await this.commentModel.find({ isDeleted: false }, fields);
  }

  async findWithQuery(
    query: Record<string, any>,
    options: {
      limit: number;
      sortBy: string;
      sortOrder: string;
    },
  ): Promise<CommentDocument[] | undefined> {
    const sortField = options?.sortBy || '_id';
    const sortDirection = options.sortOrder === 'asc' ? 1 : -1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortDirection };

    // Always filter out soft-deleted comments
    query.isDeleted = false;

    return await this.commentModel
      .find(query)
      .sort(sortObj)
      .collation({ locale: 'en', strength: 2 })
      .limit(options?.limit)
      .lean();
  }

  async countDocument(query: Record<string, any>): Promise<number> {
    // Always filter out soft-deleted comments
    query.isDeleted = false;
    return await this.commentModel.countDocuments(query);
  }
}
