import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentRepository } from '../repositories/comment.repository';
import { CommentDocument } from '../entities/comment.entity';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const commentData = {
      ...createCommentDto,
      userId,
    };
    return await this.commentRepository.create(commentData);
  }

  async findAll(): Promise<CommentDocument[]> {
    return await this.commentRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<CommentDocument>> {
    const {
      limit = 10,
      sortBy = '_id',
      sortOrder = 'desc',
      cursor,
      search,
      searchField,
      ...filters
    } = options;

    // Build query
    const query = this.buildQuery(
      filters,
      search,
      searchField,
      cursor,
      sortBy,
      sortOrder,
    );

    const data = await this.commentRepository.findWithQuery(query, {
      limit: limit + 1,
      sortBy,
      sortOrder,
    });

    if (!data) {
      throw new NotFoundException('Data not found');
    }

    const hasNextPage = data.length > limit;
    const results = data.slice(0, limit);

    const nextCursor =
      hasNextPage && results.length > 0
        ? results[results.length - 1][sortBy]?.toString()
        : undefined;

    const totalCount = await this.commentRepository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
  }

  async findById(id: string): Promise<CommentDocument | null> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async findByBlogId(blogId: string): Promise<CommentDocument[]> {
    return await this.commentRepository.findByBlogId(blogId);
  }

  async findByUserId(userId: string): Promise<CommentDocument[]> {
    return await this.commentRepository.findByUserId(userId);
  }

  async findByParentCommentId(
    parentCommentId: string,
  ): Promise<CommentDocument[]> {
    return await this.commentRepository.findByParentCommentId(parentCommentId);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<CommentDocument | null> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this comment',
      );
    }

    return await this.commentRepository.updateById(id, updateCommentDto);
  }

  async remove(id: string, userId: string): Promise<CommentDocument | null> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    return await this.commentRepository.softDeleteById(id);
  }

  private buildQuery(
    filters: Record<string, any>,
    search?: string,
    searchField?: string,
    cursor?: string,
    sortBy: string = '_id',
    sortOrder: string = 'desc',
  ): Record<string, any> {
    const query: any = { ...filters };

    // Handle search
    if (search && searchField) {
      if (searchField === 'updatedAt' || searchField === 'createdAt') {
        // Date search
        const dateSearch = new Date(search);
        if (!isNaN(dateSearch.getTime())) {
          const dateStart = new Date(dateSearch);
          dateStart.setHours(0, 0, 0, 0);
          const dateEnd = new Date(dateSearch);
          dateEnd.setHours(23, 59, 59, 999);
          query[searchField] = {
            $gte: dateStart,
            $lte: dateEnd,
          };
        }
      } else {
        // Text search (regex)
        query[searchField] = { $regex: search, $options: 'i' };
      }
    }

    // Handle cursor-based pagination
    if (cursor) {
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      if (sortDirection === -1) {
        // Descending: get items with field value < cursor
        query[sortBy] = { $lt: cursor };
      } else {
        // Ascending: get items with field value > cursor
        query[sortBy] = { $gt: cursor };
      }
    }

    return query as Record<string, any>;
  }
}
