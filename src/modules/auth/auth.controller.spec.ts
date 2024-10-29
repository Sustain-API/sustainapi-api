import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(), // Mock register function
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return user details', async () => {
      const registerDto: RegisterUserDto = {
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        wallet_address: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst',
      };

      const mockUser = {
        id: '1',
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'hashed_password',
        is_active: true,
        is_verified: false,
        wallet_address: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst',
        token_balance: 1000,
        created_at: new Date(),
        updated_at: new Date(),

        hashPassword: jest.fn(),
        isValidPassword: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);
      expect(result).toEqual({
        status_code: 201,
        message: 'User registered successfully and tokens allocated',
        user: {
          id: mockUser.id,
          full_name: mockUser.full_name,
          email: mockUser.email,
          is_active: mockUser.is_active,
          is_verified: mockUser.is_verified,
          wallet_address: mockUser.wallet_address,
          token_balance: mockUser.token_balance,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at,
        },
      });
    });
  });
});
