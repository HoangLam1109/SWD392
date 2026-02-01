import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserServiceDto } from '../dto/create-user.dto';
import { UpdateUserServiceDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserDocument } from '../models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserServiceDto: CreateUserServiceDto) {
    const { data } = await this._passwordCheck('', createUserServiceDto);
    return await this.userRepository.create(data);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  async updateUser(
    id: string,
    updateUserServiceDto: UpdateUserServiceDto,
  ): Promise<UserDocument | null> {
    const { data } = await this._passwordCheck(id, updateUserServiceDto);
    return await this.userRepository.updateById(id, data);
  }

  async deleteUser(id: string) {
    return await this.userRepository.deleteById(id);
  }

  private async _passwordCheck(
    userId: string,
    userData: UpdateUserServiceDto | CreateUserServiceDto,
  ): Promise<{
    data: UpdateUserServiceDto | CreateUserServiceDto;
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
