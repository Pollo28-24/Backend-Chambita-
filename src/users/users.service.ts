import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        perfilTrabajador: {
          include: {
            oficios: {
              include: {
                oficio: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const result = { ...user };
    delete (result as { passwordHash?: string }).passwordHash;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.usuario.update({
      where: { id: userId },
      data: dto,
    });

    const result = { ...user };
    delete (result as { passwordHash?: string }).passwordHash;
    return result;
  }
}
