import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User  } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(user_id: string): Promise<User> {
    // Fetch user by ID
    const user = await this.userRepository.findOne({ where: { id: user_id } });

    // Check if user exists
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
