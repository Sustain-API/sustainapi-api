import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { IAuthenticatedReq } from 'src/interfaces/authenticatedRequest';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser: Partial<User> = {
    id: 'b9d9682e-991a-4f57-ab44-19c13faa053f',
    full_name: 'Isaac John',
    email: 'isaacjohn@gmail.com',
    wallet_address: '0x1234...abcd',
    token_balance: 1000,
    created_at: new Date('2024-10-29T09:57:21.217Z'),
    updated_at: new Date('2024-10-29T09:57:21.217Z'),
    password: 'hashedpassword',
    is_active: true,
    is_verified: false,
  };

  const mockUserService = {
    getUserById: jest.fn(),
  };

  // Mock request object typed as IAuthenticatedReq
  const mockReq: IAuthenticatedReq = {
    user: { id: 'b9d9682e-991a-4f57-ab44-19c13faa053f' },
    headers: {},
  } as IAuthenticatedReq;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user data if found', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await userController.getUser(mockUser.id, mockReq);

      expect(result.data).toEqual({
        userId: mockUser.id,
        full_name: mockUser.full_name,
        email: mockUser.email,
        walletAddress: mockUser.wallet_address,
        createdAt: mockUser.created_at.toISOString(),
        updatedAt: mockUser.updated_at.toISOString(),
      });
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.getUserById.mockRejectedValue(new NotFoundException());

      await expect(userController.getUser(mockUser.id, mockReq)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException if unauthorized access', async () => {
      mockUserService.getUserById.mockRejectedValue(
        new UnauthorizedException(),
      );

      await expect(userController.getUser(mockUser.id, mockReq)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
