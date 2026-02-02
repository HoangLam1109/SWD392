import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../entities/user.entity';

import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    const { data } = await this._passwordCheck('', createUserDto);
    return await this.userRepository.create(data);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<UserDocument>> {
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

    const data = await this.userRepository.findWithQuery(query, {
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

    const totalCount = await this.userRepository.countDocument(query);

    return {
      data: results,
      hasNextPage,
      nextCursor,
      totalCount,
    };
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    const { data } = await this._passwordCheck(id, updateUserDto);
    return await this.userRepository.updateById(id, data);
  }

  async deleteUser(id: string) {
    return await this.userRepository.deleteById(id);
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

  private async _passwordCheck(
    userId: string,
    userData: UpdateUserDto | CreateUserDto,
  ): Promise<{
    data: UpdateUserDto | CreateUserDto;
    passwordChanged: boolean;
  }> {
    const existing = userId
      ? await this.userRepository.findById(userId, 'passwordHash')
      : null;
    if (userData.password) {
      if (existing?.passwordHash) {
        const isMatch = await bcrypt.compare(
          userData.password,
          existing.passwordHash,
        );
        if (isMatch) {
          throw new BadRequestException(
            'New password must be different from the current password',
          );
        }
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const newUser = {
        ...userData,
        passwordHash: hashedPassword,
        lastPasswordChange: new Date(),
      };

      delete (newUser as any).password;
      return { data: newUser, passwordChanged: true };
    } else return { data: userData, passwordChanged: false };
  }
}
