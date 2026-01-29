import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/utils/error.util';
import type { UserAccountType } from '../../shared/constants/role.constant';
import type { AuthenticatedUser } from "../../shared/types/express.d";

export const authorize = (requiredRoles: UserAccountType | UserAccountType[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user as AuthenticatedUser | undefined;

      if (!user || !user.role) {
        throw new AppError(401, 'Unauthorized: User or role missing');
      }

      if (user.status !== 'ACTIVE') {
        throw new AppError(401, 'Unauthorized: User is not active');
      }

      // Simple role-based authorization
      const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasRole = requiredRolesArray.includes(user.role);

      if (!hasRole) {
        throw new AppError(403, 'Forbidden: Insufficient permissions', 'INSUFFICIENT_PERMISSIONS', {
          required: requiredRolesArray,
          has: user.role
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      next(error);
    }
  };
};