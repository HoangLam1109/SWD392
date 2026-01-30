import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services/index';
import { UserAccountType } from '../../shared/constants/role.constant';
import type { AuthenticatedUser } from "../../shared/types/express";

const refreshTokenValidation = (req: Request, res: Response, next: NextFunction): any => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY as string) as {
      userId: string;
    };

    console.log('[AUTH MIDDLEWARE] Refresh Token authentication successful');
    (req as any).userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error('Refresh Token authentication failed:', error);

    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    if (!process.env.JWT_SECRET_KEY) {
      res.status(500).json({ message: 'JWT secret is not defined' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as {
      userId: string;
    };

    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(401).json({ message: 'Not authorized, user is not active or deleted' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role || UserAccountType.PLAYER,
      status: user.status,
    } as AuthenticatedUser;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
    return;
  }
};

export default {
  authenticateUser,
  refreshTokenValidation,
};
