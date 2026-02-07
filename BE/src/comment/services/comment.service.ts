import {
  BadRequestException,
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
import { BlogRepository } from '../../blog/repositories/blog.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const blog = await this.blogRepository.findById(
      createCommentDto.blogId,
      '_id',
    );
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentRepository.findById(
        createCommentDto.parentCommentId,
      );
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parentComment.blogId?.toString() !== createCommentDto.blogId) {
        throw new BadRequestException('Parent comment does not belong to blog');
      }
    }

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

    if (filters.isDeleted === undefined) {
      filters.isDeleted = false;
    } else {
      filters.isDeleted = filters.isDeleted === true || filters.isDeleted === 'true';
    }

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

  async findByBlogId(blogId: string, isDeleted?: string): Promise<CommentDocument[]> {
    const isDeletedFilter = isDeleted !== undefined ? isDeleted === 'true' : false;
    return await this.commentRepository.findByBlogId(blogId, isDeletedFilter);
  }

  async findByUserId(userId: string, isDeleted?: string): Promise<CommentDocument[]> {
    const isDeletedFilter = isDeleted !== undefined ? isDeleted === 'true' : false;
    return await this.commentRepository.findByUserId(userId, isDeletedFilter);
  }

  async findByParentCommentId(
    parentCommentId: string,
    isDeleted?: string,
  ): Promise<CommentDocument[]> {
    const isDeletedFilter = isDeleted !== undefined ? isDeleted === 'true' : false;
    return await this.commentRepository.findByParentCommentId(parentCommentId, isDeletedFilter);
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
      const dateFieldMap: Record<string, string> = {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      };
      const resolvedSearchField = dateFieldMap[searchField] || searchField;

      if (resolvedSearchField === 'updated_at' || resolvedSearchField === 'created_at') {
        // Date search
        const dateSearch = new Date(search);
        if (!isNaN(dateSearch.getTime())) {
          const dateStart = new Date(dateSearch);
          dateStart.setHours(0, 0, 0, 0);
          const dateEnd = new Date(dateSearch);
          dateEnd.setHours(23, 59, 59, 999);
          query[resolvedSearchField] = {
            $gte: dateStart,
            $lte: dateEnd,
          };
        }
      } else {
        // Text search (regex)
        query[resolvedSearchField] = { $regex: search, $options: 'i' };
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
