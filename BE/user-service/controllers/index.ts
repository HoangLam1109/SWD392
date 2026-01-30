import type { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AppError } from "../../shared/utils/error.util";
import type { AuthenticatedUser } from "../../shared/types/express.d";


const userService = new UserService();


const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User Profile']
    #swagger.description = 'Get profile information of the authenticated user'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.responses[200] = {
      description: 'Authenticated user profile retrieved successfully',
      schema: {
        user: {
          _id: 'string',
          email: 'string',
          fullName: 'string',
          identityNumber: 'string',
          gender: 'Male',
          age: 22,
          dateOfBirth: '2002-01-01',
          phoneNumber: '0123456789',
          address: 'string',
          avatar: 'https://example.com/avatar.png',
          role: ['USER']
        }
      }
    }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const currentUser = req.user as AuthenticatedUser | undefined;
    if (!currentUser?._id) {
      throw new AppError(401, "Unauthorized: User not found");
    }

    const user = await userService.getUser(currentUser._id);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  /*
    #swagger.auto = false
    #swagger.tags = ['User CRUD']
    #swagger.description = 'Get user by ID'
    #swagger.security = [{"apiKeyAuth": []}]
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'User ID',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'User retrieved successfully',
      schema: {
        _id: 'string',
        email: 'string',
        fullName: 'string',
        identityNumber: 'string',
        gender: 'Male',
        age: 22,
        dateOfBirth: '2002-01-01',
        phoneNumber: '0123456789',
        address: 'string',
        avatar: 'https://example.com/avatar.png',
        role: ['USER'],
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    }
    #swagger.responses[400] = { description: 'User ID is required' }
    #swagger.responses[401] = { description: 'Authentication required' }
    #swagger.responses[404] = { description: 'User not found' }
    #swagger.responses[500] = { description: 'Internal server error' }
  */
  try {
    const userId = req.params.id || (req.user as AuthenticatedUser)?._id;
    const userEmail = req.query.email || "";
    if (!userId) {
      const user = await userService.getUserByEmail(userEmail as string);
      if (!user) {
        throw new AppError(404, "User not found");
      }
      res.json({ user });
      return;
    }

    const user = await userService.getUser(userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    // Return in consistent format for internal API calls
    res.json({ user });
  } catch (error) {
    next(error);
  }
};


export {
  getUser,
  getCurrentUser,
};
