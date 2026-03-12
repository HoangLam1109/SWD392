import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserGameItemDto } from '../dto/create-user-game-item.dto';
import { UpdateUserGameItemDto } from '../dto/update-user-game-item.dto';
import { UserGameItemRepository } from '../repositories/user-game-item.repository';
import { UserGameItemDocument } from '../entities/user-game-item.entity';
import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class UserGameItemService {
  constructor(
    private readonly userGameItemRepository: UserGameItemRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(
    createUserGameItemDto: CreateUserGameItemDto,
  ): Promise<UserGameItemDocument | null> {
    const existingItem = await this.userGameItemRepository.findByUserAndItem(
      createUserGameItemDto.userId,
      createUserGameItemDto.itemId,
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + (createUserGameItemDto.quantity || 1);
      const result = await this.userGameItemRepository.updateById(
        existingItem.id,
        {
          quantity: newQuantity,
        },
      );
      if (!result) {
        throw new NotFoundException('Failed to update existing item');
      }
      return result;
    } else
      return await this.userGameItemRepository.create(createUserGameItemDto);
  }

  async findAll(): Promise<UserGameItemDocument[]> {
    return await this.userGameItemRepository.findAll();
  }

  async findById(id: string): Promise<UserGameItemDocument> {
    const userGameItem = await this.userGameItemRepository.findById(id);
    if (!userGameItem) {
      throw new NotFoundException('User game item not found');
    }
    return userGameItem;
  }

  async findByUserId(userId: string): Promise<UserGameItemDocument[]> {
    return await this.userGameItemRepository.findByUserId(userId);
  }

  async findByItemId(itemId: string): Promise<UserGameItemDocument[]> {
    return await this.userGameItemRepository.findByItemId(itemId);
  }

  async findAllWithPagination(
    options: PaginationOptionsDto,
  ): Promise<PaginationResponseDto<UserGameItemDocument>> {
    return this.paginationService.paginate(
      this.userGameItemRepository,
      options,
    );
  }

  async update(
    id: string,
    updateUserGameItemDto: UpdateUserGameItemDto,
  ): Promise<UserGameItemDocument> {
    const userGameItem = await this.userGameItemRepository.findById(id);
    if (!userGameItem) {
      throw new NotFoundException('User game item not found');
    }
    const result = await this.userGameItemRepository.updateById(
      id,
      updateUserGameItemDto,
    );
    if (!result) {
      throw new NotFoundException('Failed to update user game item');
    }
    return result;
  }

  async remove(id: string): Promise<UserGameItemDocument> {
    const userGameItem = await this.userGameItemRepository.findById(id);
    if (!userGameItem) {
      throw new NotFoundException('User game item not found');
    }
    const result = await this.userGameItemRepository.deleteById(id);
    if (!result) {
      throw new NotFoundException('Failed to delete user game item');
    }
    return result;
  }

  async equipItem(id: string): Promise<UserGameItemDocument> {
    const userGameItem = await this.userGameItemRepository.findById(id);
    if (!userGameItem) {
      throw new NotFoundException('User game item not found');
    }

    if (!userGameItem.isEquipped) {
      await this.unequipItemsByUser(userGameItem.userId);
    }

    const result = await this.userGameItemRepository.updateById(id, {
      isEquipped: !userGameItem.isEquipped,
    });
    if (!result) {
      throw new NotFoundException('Failed to toggle equip status');
    }
    return result;
  }

  async unequipItemsByUser(userId: string): Promise<void> {
    const userGameItems =
      await this.userGameItemRepository.findByUserId(userId);
    if (!userGameItems) {
      return;
    }
    for (const item of userGameItems) {
      if (item.isEquipped) {
        await this.userGameItemRepository.updateById(item.id, {
          isEquipped: false,
        });
      }
    }
  }

  async deleteManyByUserId(userId: string): Promise<void> {
    await this.userGameItemRepository.deleteManyByUserId(userId);
  }
}
