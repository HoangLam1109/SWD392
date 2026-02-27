import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

export interface IPaginationRepository<T> {
  findWithQuery(
    query: Record<string, any>,
    options: { limit: number; sortBy: string; sortOrder: string },
  ): Promise<T[] | undefined>;
  countDocument(query: Record<string, any>): Promise<number>;
}

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: IPaginationRepository<T>,
    options: PaginationOptionsDto,
    additionalFilters: Record<string, any> = {},
  ): Promise<PaginationResponseDto<T>> {
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
      { ...additionalFilters, ...filters },
      search,
      searchField,
      cursor,
      sortBy,
      sortOrder,
    );

    const data = await repository.findWithQuery(query, {
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

    const totalCount = await repository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
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
