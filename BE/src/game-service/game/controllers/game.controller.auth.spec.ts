import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from '../services/game.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserRole } from '../../../user-service/user/enum/user.enum';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import {
  UnauthorizedException,
  ForbiddenException,
  ExecutionContext,
} from '@nestjs/common';

describe('GameController - Role-based Access Control', () => {
  let controller: GameController;

  const mockGameService = {
    createGame: jest.fn(),
    updateGame: jest.fn(),
    deleteGame: jest.fn(),
    findAllWithPagination: jest.fn(),
    findGameById: jest.fn(),
    findGameByCategoryId: jest.fn(),
    findGameByReleaseDate: jest.fn(),
    findByPrice: jest.fn(),
    findAllForIndexing: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          const token = request.headers.authorization?.split(' ')[1];

          if (!token) {
            throw new UnauthorizedException('Not authorized, no token');
          }

          try {
            const payload = mockJwtService.verifyAsync(token);
            request['user'] = payload;
            return true;
          } catch {
            throw new UnauthorizedException('Invalid token');
          }
        },
      })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          const user = request['user'];

          if (!user) {
            throw new UnauthorizedException('User not authenticated');
          }

          // For testing purposes, check if user has ADMIN or MANAGER role
          const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER];
          if (!allowedRoles.includes(user.role as UserRole)) {
            throw new ForbiddenException('Access denied');
          }

          return true;
        },
      })
      .compile();

    controller = module.get<GameController>(GameController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /games - Create Game', () => {
    const createGameDto: CreateGameDto = {
      title: 'Test Game',
      price: 29.99,
      isActive: true,
      categoryId: 'category1',
    };

    it('should allow ADMIN user to create game', async () => {
      const adminPayload = { sub: 'user1', role: UserRole.ADMIN };

      mockJwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockGameService.createGame.mockResolvedValue({
        id: '1',
        ...createGameDto,
      } as GameResponseDto);

      const result = await controller.create(createGameDto);

      expect(result).toBeDefined();
      expect(mockGameService.createGame).toHaveBeenCalledWith(createGameDto);
    });

    it('should allow MANAGER user to create game', async () => {
      const managerPayload = { sub: 'user2', role: UserRole.MANAGER };

      mockJwtService.verifyAsync.mockResolvedValue(managerPayload);
      mockGameService.createGame.mockResolvedValue({
        id: '1',
        ...createGameDto,
      } as GameResponseDto);

      const result = await controller.create(createGameDto);

      expect(result).toBeDefined();
      expect(mockGameService.createGame).toHaveBeenCalledWith(createGameDto);
    });

    it('should reject PLAYER user trying to create game', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);

      await expect(controller.create(createGameDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockGameService.createGame).not.toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(controller.create(createGameDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockGameService.createGame).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /games/:id - Update Game', () => {
    const updateGameDto: UpdateGameDto = {
      title: 'Updated Game Title',
    };

    it('should allow ADMIN user to update game', async () => {
      const adminPayload = { sub: 'user1', role: UserRole.ADMIN };

      mockJwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockGameService.updateGame.mockResolvedValue({
        id: '1',
        ...updateGameDto,
      } as GameResponseDto);

      const result = await controller.update('1', updateGameDto);

      expect(result).toBeDefined();
      expect(mockGameService.updateGame).toHaveBeenCalledWith(
        '1',
        updateGameDto,
      );
    });

    it('should allow MANAGER user to update game', async () => {
      const managerPayload = { sub: 'user2', role: UserRole.MANAGER };

      mockJwtService.verifyAsync.mockResolvedValue(managerPayload);
      mockGameService.updateGame.mockResolvedValue({
        id: '1',
        ...updateGameDto,
      } as GameResponseDto);

      const result = await controller.update('1', updateGameDto);

      expect(result).toBeDefined();
      expect(mockGameService.updateGame).toHaveBeenCalledWith(
        '1',
        updateGameDto,
      );
    });

    it('should reject PLAYER user trying to update game', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);

      await expect(controller.update('1', updateGameDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockGameService.updateGame).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /games/:id - Delete Game', () => {
    it('should allow ADMIN user to delete game', async () => {
      const adminPayload = { sub: 'user1', role: UserRole.ADMIN };

      mockJwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockGameService.deleteGame.mockResolvedValue({
        id: '1',
      } as GameResponseDto);

      const result = await controller.remove('1');

      expect(result).toBeDefined();
      expect(mockGameService.deleteGame).toHaveBeenCalledWith('1');
    });

    it('should allow MANAGER user to delete game', async () => {
      const managerPayload = { sub: 'user2', role: UserRole.MANAGER };

      mockJwtService.verifyAsync.mockResolvedValue(managerPayload);
      mockGameService.deleteGame.mockResolvedValue({
        id: '1',
      } as GameResponseDto);

      const result = await controller.remove('1');

      expect(result).toBeDefined();
      expect(mockGameService.deleteGame).toHaveBeenCalledWith('1');
    });

    it('should reject PLAYER user trying to delete game', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);

      await expect(controller.remove('1')).rejects.toThrow(ForbiddenException);
      expect(mockGameService.deleteGame).not.toHaveBeenCalled();
    });
  });

  describe('GET /games - Public Access', () => {
    it('should allow any user to view games list', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);
      mockGameService.findAllWithPagination.mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      });

      const result = await controller.findAllWithPagination({});

      expect(result).toBeDefined();
      expect(mockGameService.findAllWithPagination).toHaveBeenCalled();
    });
  });

  describe('GET /games/:id - Public Access', () => {
    it('should allow any user to view game details', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);
      mockGameService.findGameById.mockResolvedValue({
        id: '1',
        title: 'Test Game',
      } as GameResponseDto);

      const result = await controller.findOne('1');

      expect(result).toBeDefined();
      expect(mockGameService.findGameById).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /games/index - Admin/Manager Access', () => {
    it('should allow ADMIN user to index games', async () => {
      const adminPayload = { sub: 'user1', role: UserRole.ADMIN };

      mockJwtService.verifyAsync.mockResolvedValue(adminPayload);
      mockGameService.findAllForIndexing.mockResolvedValue([]);

      const result = await controller.indexAllGames();

      expect(result).toBeDefined();
      expect(mockGameService.findAllForIndexing).toHaveBeenCalled();
    });

    it('should allow MANAGER user to index games', async () => {
      const managerPayload = { sub: 'user2', role: UserRole.MANAGER };

      mockJwtService.verifyAsync.mockResolvedValue(managerPayload);
      mockGameService.findAllForIndexing.mockResolvedValue([]);

      const result = await controller.indexAllGames();

      expect(result).toBeDefined();
      expect(mockGameService.findAllForIndexing).toHaveBeenCalled();
    });

    it('should reject PLAYER user trying to index games', async () => {
      const playerPayload = { sub: 'user3', role: UserRole.PLAYER };

      mockJwtService.verifyAsync.mockResolvedValue(playerPayload);

      await expect(controller.indexAllGames()).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockGameService.findAllForIndexing).not.toHaveBeenCalled();
    });
  });
});
