import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        ConfigService,
        JwtService, // Provide JwtService to the testing module
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and save in database', async () => {
      const registerDto: RegisterUserDto = {
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        wallet_address: '0x1234abcd5678efgh9012ijkl3456mnop7890qrst',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const mockUser = {
        id: '1',
        full_name: 'John Doe',
        email: 'johndoe@example.com',
        password: hashedPassword,
        wallet_address: registerDto.wallet_address,
        token_balance: 1000,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true,
        is_verified: false,

        hashPassword: jest.fn(),
        isValidPassword: jest.fn().mockResolvedValue(true),
      };

      // Mock user repository behavior
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No user found with this email
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: registerDto.email } });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        full_name: registerDto.full_name,
        password: expect.any(String),
        wallet_address: registerDto.wallet_address,
        token_balance: 1000,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
