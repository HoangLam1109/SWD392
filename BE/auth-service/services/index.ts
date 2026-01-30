import dotenv from "dotenv";
import { UserAccountType } from "../../shared/constants/role.constant";

dotenv.config();

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role?: UserAccountType;
  avatar?: string;
  status: string;
}

export const userService = {
  async getUserById(id: string): Promise<IUser | null> {
    try {
      const response = await fetch(`${process.env.USER_SERVICE_URL || 'http://localhost:3002'}/users/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error calling user service:', error);
      return null;
    }
  },
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const response = await fetch(`${process.env.USER_SERVICE_URL || 'http://localhost:3002'}/users?email=${email}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error calling user service:', error);
      return null;
    }
  },
};
