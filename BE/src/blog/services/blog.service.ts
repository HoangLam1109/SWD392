import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogDocument } from '../entities/blog.entity';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { BlogStatus } from '../enum/blog.enum';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async create(
    createBlogDto: CreateBlogDto,
    userId: string,
  ): Promise<BlogDocument> {
    const blogData = {
      ...createBlogDto,
      userId,
      status: createBlogDto.status || BlogStatus.DRAFT,
      publishedAt:
        createBlogDto.status === BlogStatus.PUBLISHED ? new Date() : null,
    };
    return await this.blogRepository.create(blogData);
  }

  async findAll(): Promise<BlogDocument[]> {
    return await this.blogRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<BlogDocument>> {
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

    const data = await this.blogRepository.findWithQuery(query, {
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

    const totalCount = await this.blogRepository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
  }

  async findById(id: string): Promise<BlogDocument | null> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    // Increment view count
    await this.blogRepository.incrementViewCount(id);
    return blog;
  }

  async findByUserId(userId: string): Promise<BlogDocument[]> {
    return await this.blogRepository.findByUserId(userId);
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    userId: string,
  ): Promise<BlogDocument | null> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if user owns the blog
    if (blog.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this blog');
    }

    const updateData: any = { ...updateBlogDto };

    // If status is being changed to PUBLISHED and not yet published
    if (
      updateBlogDto.status === BlogStatus.PUBLISHED &&
      blog.status !== BlogStatus.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    return await this.blogRepository.updateById(id, updateData);
  }

  async remove(id: string, userId: string): Promise<BlogDocument | null> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if user owns the blog
    if (blog.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this blog');
    }

    return await this.blogRepository.softDeleteById(id);
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
