import { UserAccountType } from '../constants/role.constant';

export interface AuthenticatedUser {
  _id: string;
  email: string;
  role: UserAccountType;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
