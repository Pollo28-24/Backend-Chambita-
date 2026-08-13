import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return { id: userId, email: 'user@chambita.com' };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    return { id: userId, ...dto };
  }
}
