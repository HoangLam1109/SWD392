import type { Request } from 'express';
import { UserAccountType } from '../../user-service/interfaces/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserAccountType;
        isActive: boolean;
        isDeleted: boolean;
      };
    }
  }
}

export {};
