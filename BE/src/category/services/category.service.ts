import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDocument } from '../entities/category.entity';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    if (createCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findById(
        createCategoryDto.parentCategoryId,
      );
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    return await this.categoryRepository.create(createCategoryDto);
  }

  async findAll(): Promise<CategoryDocument[]> {
    return await this.categoryRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<CategoryDocument>> {
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

    const data = await this.categoryRepository.findWithQuery(query, {
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

    const totalCount = await this.categoryRepository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
  }

  async findById(id: string): Promise<CategoryDocument | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findByParentCategoryId(
    parentCategoryId: string,
  ): Promise<CategoryDocument[]> {
    return await this.categoryRepository.findByParentCategoryId(
      parentCategoryId,
    );
  }

  async findAllParentCategories(): Promise<CategoryDocument[]> {
    return await this.categoryRepository.findAllParentCategories();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument | null> {
    if (updateCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findById(
        updateCategoryDto.parentCategoryId,
      );
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    return await this.categoryRepository.updateById(id, updateCategoryDto);
  }

  async remove(id: string): Promise<CategoryDocument | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const hasChildren = await this.categoryRepository.hasChildren(id);
    if (hasChildren) {
      throw new BadRequestException(
        'Cannot delete category because it has subcategories',
      );
    }

    return await this.categoryRepository.deleteById(id);
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

      if (resolvedSearchField === 'created_at' || resolvedSearchField === 'updated_at') {
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
