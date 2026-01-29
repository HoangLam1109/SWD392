import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/index";

import type { IUser } from "../models/user.model";
import { AppError } from "../../shared/utils/error.util";

export class UserService {
  async getUser(userId: string): Promise<IUser | null> {
    return await userRepository.findById(
      userId,
      "_id email fullName phoneNumber avatar identityNumber gender age dateOfBirth address role isActive"
    );
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await userRepository.findByEmail(email);
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    return await userRepository.findByPhoneNumber(phoneNumber);
  }

  async searchUsersByFullName(
    keyword: string,
    limit: number = 20
  ): Promise<IUser[]> {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }
    return await userRepository.searchByFullName(
      keyword.trim(),
      "_id fullName email phoneNumber",
      limit
    );
  }
}
