import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSystemRequirementDto } from '../dto/create-system_requirement.dto';
import { UpdateSystemRequirementDto } from '../dto/update-system_requirement.dto';
import { SystemRequirementRepository } from '../repositories/system_requirement.repository';
import { SystemRequirementDocument } from '../entities/system_requirement.entity';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { GameRepository } from '../../game/repositories/game.repository';

@Injectable()
export class SystemRequirementService {
  constructor(
    private readonly systemRequirementRepository: SystemRequirementRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  async create(
    createSystemRequirementDto: CreateSystemRequirementDto,
  ): Promise<SystemRequirementDocument> {
    const game = await this.gameRepository.findById(
      createSystemRequirementDto.gameId,
      '_id',
    );
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return await this.systemRequirementRepository.create(
      createSystemRequirementDto,
    );
  }

  async findAll(): Promise<SystemRequirementDocument[]> {
    return await this.systemRequirementRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<SystemRequirementDocument>> {
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

    const data = await this.systemRequirementRepository.findWithQuery(query, {
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

    const totalCount =
      await this.systemRequirementRepository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
  }

  async findById(id: string): Promise<SystemRequirementDocument | null> {
    const requirement = await this.systemRequirementRepository.findById(id);
    if (!requirement) {
      throw new NotFoundException('System requirement not found');
    }
    return requirement;
  }

  async findByGameId(gameId: string): Promise<SystemRequirementDocument[]> {
    return await this.systemRequirementRepository.findByGameId(gameId);
  }

  async update(
    id: string,
    updateSystemRequirementDto: UpdateSystemRequirementDto,
  ): Promise<SystemRequirementDocument | null> {
    if (updateSystemRequirementDto.gameId) {
      const game = await this.gameRepository.findById(
        updateSystemRequirementDto.gameId,
        '_id',
      );
      if (!game) {
        throw new NotFoundException('Game not found');
      }
    }
    return await this.systemRequirementRepository.updateById(
      id,
      updateSystemRequirementDto,
    );
  }

  async remove(id: string): Promise<SystemRequirementDocument | null> {
    return await this.systemRequirementRepository.deleteById(id);
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
      // Text search (regex)
      query[searchField] = { $regex: search, $options: 'i' };
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
