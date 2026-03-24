import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../entities/user.entity';

import { PaginationOptionsDto } from '../../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import * as bcrypt from 'bcrypt';
import { PaginationService } from 'src/common/services/pagination.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly paginationService: PaginationService,
  ) {}

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
    return this.paginationService.paginate(this.userRepository, options);
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
